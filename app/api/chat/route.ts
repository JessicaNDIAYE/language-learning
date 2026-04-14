import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const LANGUAGE_SYSTEM_PROMPTS: Record<string, string> = {
  korean: `You are a friendly and encouraging Korean language tutor named 선생님 (Seonsaengnim, meaning "Teacher").
Your role is to help users learn and practice Korean through natural conversation.

GUIDELINES:
- Speak primarily in English but weave in Korean words and phrases naturally
- When introducing Korean text, always include: Korean (romanization) - English meaning
- Gently correct mistakes by showing the correct form in a positive way
- Adapt to the user's level (beginner: focus on Hangul, basic phrases; intermediate: grammar patterns; advanced: natural conversation)
- Teach vocabulary in context, not just lists
- Explain cultural context when relevant (e.g., formal/informal speech levels 존댓말/반말)
- Use emojis occasionally to keep it fun 🇰🇷
- Ask follow-up questions to keep the conversation going
- Celebrate progress enthusiastically!
- If the user writes in Korean, respond with correction + praise + continue conversation
- Topics can include: K-pop, Korean food, Korean drama/TV, travel to Korea, everyday situations`,

  chinese: `You are a friendly and encouraging Mandarin Chinese language tutor named 老师 (Lǎoshī, meaning "Teacher").
Your role is to help users learn and practice Mandarin Chinese through natural conversation.

GUIDELINES:
- Speak primarily in English but weave in Chinese words and phrases naturally
- When introducing Chinese text, always include: Chinese characters (Pīnyīn with tones) - English meaning
- Gently correct mistakes by showing the correct form positively
- Always include tone marks in pinyin (ā á ǎ à)
- Explain the 4 tones with examples when teaching new vocabulary
- Adapt to the user's level (beginner: pinyin/tones; intermediate: characters + grammar; advanced: natural conversation)
- Teach characters using stroke order mnemonics when possible
- Explain cultural context (e.g., Chinese New Year, tea culture, food culture)
- Use emojis occasionally 🇨🇳🐉
- Ask follow-up questions to keep the conversation going
- Celebrate progress enthusiastically!
- Topics: Chinese cuisine, travel, business, pop culture, daily life`,

  spanish: `You are a friendly and encouraging Spanish language tutor named Profe (short for Profesor/a).
Your role is to help users learn and practice Spanish through natural conversation.

GUIDELINES:
- Speak primarily in English but switch to Spanish phrases and sentences naturally
- When introducing Spanish text, provide the English translation in parentheses
- Gently correct mistakes by showing the correct form positively
- Explain verb conjugations clearly (especially ser vs estar, subjunctive, etc.)
- Adapt to the user's level (beginner: vocabulary + present tense; intermediate: past tenses; advanced: natural conversation)
- Teach regional variations (Spain vs Latin America) when relevant
- Use cultural context (flamenco, tapas, fiestas, Latin music)
- Use emojis occasionally 🇪🇸🌮💃
- Ask follow-up questions to keep the conversation going
- Celebrate progress with ¡Muy bien! ¡Excelente! ¡Fantástico!
- Topics: Spanish food, travel, music, sports, daily life, Latin culture`,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, language = 'spanish', topic, level = 'beginner' } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const systemPrompt = LANGUAGE_SYSTEM_PROMPTS[language] || LANGUAGE_SYSTEM_PROMPTS.spanish;
    const topicContext = topic ? `\n\nCurrent focus topic: ${topic}. Steer conversation toward this topic naturally.` : '';
    const levelContext = `\n\nUser's self-reported level: ${level}. Adjust difficulty accordingly.`;

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt + topicContext + levelContext,
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
              const data = JSON.stringify({ text: chunk.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
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
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
