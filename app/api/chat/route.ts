import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/prompts';
import { type LanguageCode, getLanguage, getDefaultLevel } from '@/lib/languages';

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY is not set in Vercel environment variables.' },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Prompt build failed: ${msg}` }, { status: 500 });
  }

  // Use non-streaming create so we can catch Anthropic errors before sending headers
  try {
    const anthropicMessages = (messages as Array<{ role: string; content: string }>).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const stream = client.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 512,
            system: systemPrompt,
            messages: anthropicMessages,
          });

          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          // Send the error as a data event so the client can read it
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat API error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
