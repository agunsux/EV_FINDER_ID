export default async function handler(req, res) {
  const { query, vehicles } = req.body;

  const topVehicles = vehicles.slice(0, 5);

  const prompt = `
You are Antigravity, EV decision intelligence system.

User Query:
${query}

Available Vehicles (ground truth data):
${JSON.stringify(topVehicles, null, 2)}

TASK:
- Rank the best EV for this user
- Explain reasoning
- Show pros and cons
- ONLY use the provided data
- NEVER invent specs
- If missing data → say "data tidak tersedia"
- Always compare objectively

OUTPUT FORMAT:

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

  // Mock implementation for callLLM since this is scaffolding
  const callLLM = async (p) => {
    return "This is a placeholder for the actual LLM response. Wire up Gemini / OpenAI here.";
  };

  const aiResponse = await callLLM(prompt); // Gemini / OpenAI / whatever

  res.json({
    result: aiResponse,
    usedVehicles: topVehicles,
  });
}
