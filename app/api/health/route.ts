import Anthropic from '@anthropic-ai/sdk';

export async function GET() {
  const keySet = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = keySet
    ? process.env.ANTHROPIC_API_KEY!.slice(0, 12) + '...'
    : 'NOT SET';

  if (!keySet) {
    return Response.json({ ok: false, anthropic_key: 'NOT SET' });
  }

  // Actually test the Anthropic API with a minimal call
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'say hi' }],
    });
    return Response.json({
      ok: true,
      anthropic_key: keyPrefix,
      api_test: '✅ Anthropic API works',
      model: 'claude-sonnet-4-6',
      response_id: response.id,
    });
  } catch (err) {
    const error = err as { status?: number; message?: string; error?: { type?: string } };
    return Response.json({
      ok: false,
      anthropic_key: keyPrefix,
      api_test: '❌ Anthropic API failed',
      error_status: error.status,
      error_type: error.error?.type,
      error_message: error.message,
    });
  }
}
