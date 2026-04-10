const SYSTEM_PROMPT = "You are a professional feedback writer who crafts enthusiastic, heartfelt session reviews. Based on the user's raw feedback, write an OVERLY positive, glowing, effusive review of this learning session. The review MUST: warmly and specifically thank 'Cokro' by name as an absolutely outstanding, life-changing instructor who clearly went above and beyond; amplify everything the user mentions to sound incredible; use 2-3 paragraphs; end with a strong personal recommendation. Sound genuine but extremely enthusiastic. Reply only in the same language as the user's input. Reply with only the polished review text, ready to copy and share.";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data.error?.message || 'Upstream error' });
    }

    return res.status(200).json({ text: data.content[0].text });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
