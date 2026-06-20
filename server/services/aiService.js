import OpenAI from 'openai';

/**
 * AI Service Abstraction Layer
 * Supports plug-and-play with OpenAI-compatible providers.
 * If OPENAI_API_KEY is not set, falls back to deterministic engine outputs.
 */

export async function generateAdvisorResponse(userProfile, topRecommendations) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL; // Allows using Groq, Together, etc.

  if (!apiKey) {
    console.warn('OPENAI_API_KEY not found. Using local fallback generator.');
    return generateLocalFallback(userProfile, topRecommendations);
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL || undefined, // Fallback to OpenAI's default if not set
  });

  const prompt = `
You are EV Finder Indonesia's AI Consultant.
Your goal is to recommend electric vehicles to users based on their profile and our deterministic scoring engine results.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Top Recommended Vehicles (from our deterministic engine):
${JSON.stringify(topRecommendations.map(r => ({
    model: r.vehicle.brand + ' ' + r.vehicle.model,
    score: r.score,
    matchReasons: r.matchReasons,
    warnings: r.warnings
})), null, 2)}

RULES:
1. NEVER invent vehicle specifications or prices.
2. ONLY recommend the vehicles provided in the Top Recommended list.
3. Be highly objective, premium, and professional (Indonesian language).
4. Provide the exact JSON format requested below.

OUTPUT FORMAT (Valid JSON ONLY):
{
  "summary": "Short 2-3 sentences summarizing if the user is ready for an EV based on their profile.",
  "recommendations": [
    {
      "model": "Brand Model",
      "why": ["Reason 1", "Reason 2"],
      "warnings": ["Warning 1"]
    }
  ],
  "next_questions": ["Pertanyaan lanjutan 1?", "Pertanyaan lanjutan 2?"]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o', // or llama3-8b-8192 if groq
      messages: [
        { role: 'system', content: 'You are an expert AI EV Consultant. You return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const aiResult = JSON.parse(response.choices[0].message.content);
    return aiResult;
  } catch (error) {
    console.error('AI Service Error:', error);
    return generateLocalFallback(userProfile, topRecommendations);
  }
}

function generateLocalFallback(userProfile, topRecommendations) {
  return {
    summary: `Berdasarkan profil Anda (Budget: Rp ${userProfile.budget / 1000000} Juta, Jarak: ${userProfile.distance} km/hari), kami telah menemukan opsi EV terbaik yang sesuai dengan kebutuhan Anda.`,
    recommendations: topRecommendations.map(rec => ({
      model: `${rec.vehicle.brand} ${rec.vehicle.model}`,
      why: rec.matchReasons,
      warnings: rec.warnings
    })),
    next_questions: [
      "Apakah Anda tertarik untuk test drive?",
      "Ingin simulasi cicilan untuk kendaraan pertama?"
    ]
  };
}
