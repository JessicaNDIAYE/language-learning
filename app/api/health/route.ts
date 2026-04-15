import { Mistral } from '@mistralai/mistralai';

export async function GET() {
  const keySet = !!process.env.MISTRAL_API_KEY;
  const keyPrefix = keySet
    ? process.env.MISTRAL_API_KEY!.slice(0, 10) + '...'
    : 'NOT SET';

  if (!keySet) {
    return Response.json({ ok: false, mistral_key: 'NOT SET' });
  }

  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  try {
    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: 'say hi' }],
      maxTokens: 5,
    });
    return Response.json({
      ok: true,
      mistral_key: keyPrefix,
      api_test: '✅ Mistral API works',
      model: 'mistral-large-latest',
      response_preview: response.choices?.[0]?.message?.content,
    });
  } catch (err) {
    const error = err as { status?: number; message?: string };
    return Response.json({
      ok: false,
      mistral_key: keyPrefix,
      api_test: '❌ Mistral API failed',
      error_status: error.status,
      error_message: error.message,
    });
  }
}
