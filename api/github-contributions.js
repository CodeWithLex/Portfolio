// Vercel Serverless Function: Real-Time GitHub Contributions Endpoint
// Fetches rolling 52-week activity for focalstack-lex with edge caching

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const username = req.query.user || 'focalstack-lex';

  // Edge cache: 30 min fresh, 1 hour CDN cache, 24h stale-while-revalidate
  res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');

  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    const data = await response.json();
    return res.status(200).json({
      success: true,
      username,
      total: data.total,
      contributions: data.contributions
    });
  } catch (error) {
    console.error('Error fetching contributions from primary API:', error);

    // Fallback: try raw GitHub contributions HTML endpoint
    try {
      const ghRes = await fetch(`https://github.com/users/${username}/contributions`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (ghRes.ok) {
        const html = await ghRes.text();
        const dayMatches = [...html.matchAll(/data-date="([^"]+)"(?:[^>]*?data-level="([^"]+)")?(?:[^>]*?id="contribution-day-component-[^"]*")?[^>]*?>([\s\S]*?)<\/td>/g)];
        if (dayMatches.length > 0) {
          const contributions = dayMatches.map(m => {
            const date = m[1];
            const level = parseInt(m[2] || '0', 10);
            return { date, count: level > 0 ? level * 2 : 0, level };
          });
          return res.status(200).json({
            success: true,
            username,
            total: { lastYear: contributions.reduce((acc, d) => acc + d.count, 0) },
            contributions
          });
        }
      }
    } catch (fallbackErr) {
      console.error('Fallback scraping failed:', fallbackErr);
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contributions',
      message: error.message
    });
  }
}
