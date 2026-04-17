export function getHealth(req, res) {
  const hasSupabase = Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_ANON_KEY?.trim());
  const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim());
  res.json({
    ok: true,
    service: 'ReceiptIQ API',
    timestamp: new Date().toISOString(),
    config: {
      supabase: hasSupabase,
      gemini: hasGemini,
    },
  });
}
