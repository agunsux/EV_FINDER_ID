import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Enforce POST requests only
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, vehicles } = req.body;

    if (!query || !vehicles || !Array.isArray(vehicles)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Initialize Anthropic safely on the server side
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `
You are Antigravity, EV decision intelligence system for Southeast Asia (specifically Indonesia).

User Query:
${query}

Available Vehicles (ground truth data):
${JSON.stringify(vehicles, null, 2)}

TASK:
- Rank the best EV for this user (MAX 3 recommendations)
- Explain reasoning
- Show pros and cons
- ONLY use the provided data
- NEVER invent specs
- If missing data → say "data tidak tersedia"
- Always compare objectively

OUTPUT FORMAT MUST BE EXACTLY AS BELOW:

## Rekomendasi Utama

1. [Nama Mobil]
- [Alasan/Kelebihan 1]
- [Alasan/Kelebihan 2]

Kekurangan:
- [Kekurangan 1]

---

## Kesimpulan
[Kesimpulan akhir yang singkat dan tegas]
`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      temperature: 0.2, // Low temp for strict analytical reasoning
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    res.status(200).json({
      result: response.content[0].text,
    });
  } catch (error) {
    console.error('Antigravity AI Error:', error);
    // Secure fallback: do not leak API errors to client
    res.status(500).json({ result: "AI tidak tersedia" });
  }
}
