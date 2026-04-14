import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/prompts';
import { type LanguageCode, getLanguage, getDefaultLevel } from '@/lib/languages';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      messages,
      language = 'spanish',
      levelCode,
      scenario = null,
      memory = null,
    } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const lang = getLanguage(language as LanguageCode);
    const resolvedLevel = levelCode || getDefaultLevel(lang.levelSystem);

    const systemPrompt = buildSystemPrompt({
      language: language as LanguageCode,
      levelCode: resolvedLevel,
      levelSystem: lang.levelSystem,
      scenario,
      userMemory: memory,
    });

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 512, // Keep responses short — this is a chat app
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
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
          controller.error(err);
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
    console.error('Chat API error:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
