import { getRecommendations } from '../server/services/recommendationEngine.js';
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userProfile = req.body;

    if (!userProfile || !userProfile.budget || !userProfile.distance) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Step 1: Run deterministic scoring engine to get top 10 vehicles securely
    const top10Recommendations = getRecommendations(userProfile);

    // Step 2: Feed deterministic data and user profile to Claude for personalized response and top 3 selection
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `
You are EV Finder Indonesia's AI Consultant.
Your goal is to recommend the best 3 electric vehicles to users based on their profile and our deterministic scoring engine results.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Top 10 Recommended Vehicles (from our deterministic engine):
${JSON.stringify(top10Recommendations.map(r => ({
    model: r.vehicle.brand + ' ' + r.vehicle.model,
    price: r.vehicle.price,
    range: r.vehicle.rangeKm,
    score: r.score,
    matchReasons: r.matchReasons,
    warnings: r.warnings
})), null, 2)}

RULES:
1. NEVER invent vehicle specifications or prices.
2. ONLY select exactly 3 vehicles from the Top 10 list provided above.
3. Be highly objective, premium, and professional (Indonesian language).
4. Provide the exact JSON format requested below.

OUTPUT FORMAT (Valid JSON ONLY, no other text):
{
  "summary": "Short 2-3 sentences summarizing if the user is ready for an EV based on their profile.",
  "recommendations": [
    {
      "model": "Brand Model",
      "price": "Rp xxx Juta",
      "range": "xxx km",
      "score": 100,
      "why": ["Reason 1", "Reason 2"]
    }
  ]
}
`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      temperature: 0.2,
      system: "You are an expert AI EV Consultant. You return valid JSON only. Do not wrap in markdown tags.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    let jsonString = message.content[0].text;
    // Strip markdown formatting if Claude adds it
    if (jsonString.startsWith('\`\`\`json')) {
      jsonString = jsonString.replace(/^\`\`\`json\n?/, '').replace(/\`\`\`\n?$/, '');
    } else if (jsonString.startsWith('\`\`\`')) {
      jsonString = jsonString.replace(/^\`\`\`\n?/, '').replace(/\`\`\`\n?$/, '');
    }

    const aiResult = JSON.parse(jsonString.trim());
    
    res.status(200).json(aiResult);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
