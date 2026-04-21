import { Mistral } from '@mistralai/mistralai';
import { buildSystemPrompt, type VibeLevel } from '@/lib/prompts';
import { type LanguageCode, getLanguage, getDefaultLevel } from '@/lib/languages';

export async function POST(request: Request) {
  if (!process.env.MISTRAL_API_KEY) {
    return Response.json(
      { error: 'MISTRAL_API_KEY is not set in environment variables.' },
      { status: 500 }
    );
  }

  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    messages,
    language = 'spanish',
    levelCode,
    scenario = null,
    memory = null,
    vibeLevel = 'normal',
    languageMode = 'mixed',
  } = body as Record<string, unknown>;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'messages must be a non-empty array' }, { status: 400 });
  }

  let systemPrompt: string;
  try {
    const lang = getLanguage(language as LanguageCode);
    const resolvedLevel = (levelCode as string) || getDefaultLevel(lang.levelSystem);
    systemPrompt = buildSystemPrompt({
      language: language as LanguageCode,
      levelCode: resolvedLevel,
      levelSystem: lang.levelSystem,
      scenario: (scenario as string) || null,
      userMemory: (memory as string) || null,
      vibeLevel: (vibeLevel as VibeLevel) || 'normal',
      languageMode: (languageMode as 'immersive' | 'mixed') || 'mixed',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Prompt build failed: ${msg}` }, { status: 500 });
  }

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        const mistralMessages = [
          // Mistral uses system as a role inside messages array
          { role: 'system' as const, content: systemPrompt },
          // Filter out any empty-content messages — Mistral rejects them with 400
          ...(messages as Array<{ role: string; content: string }>)
            .filter(m => typeof m.content === 'string' && m.content.trim() !== '')
            .map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
        ];

        const stream = await client.chat.stream({
          model: 'mistral-large-latest',
          messages: mistralMessages,
          maxTokens: 512,
        });

        for await (const chunk of stream) {
          const content = chunk.data.choices[0]?.delta?.content;
          const text = typeof content === 'string' ? content : null;
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
        );
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
