export async function GET() {
  const keySet = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = keySet
    ? process.env.ANTHROPIC_API_KEY!.slice(0, 12) + '...'
    : 'NOT SET';

  return Response.json({
    ok: keySet,
    anthropic_key: keyPrefix,
    node_env: process.env.NODE_ENV,
  });
}
