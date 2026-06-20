import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getRecommendations, UserProfile, RecommendationResult } from '../../../lib/recommendationEngine';
import { getAdminDb } from '../../../lib/firebase-admin';
import { EVModel } from '../../../types/ev';

export async function POST(request: Request) {
  try {
    const userProfile: UserProfile = await request.json();

    if (!userProfile || !userProfile.budget || !userProfile.distance) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Step 1: Fetch all vehicles from Firestore
    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection('vehicles').get();
    const vehicles: EVModel[] = snapshot.docs.map((doc: any) => doc.data() as EVModel);

    // Step 2: Run deterministic scoring engine to get top vehicles
    const topRecommendations = getRecommendations(userProfile, vehicles);

    // Step 3: Feed deterministic data and user profile to AI for personalized response
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL; // Allows using Groq, Together, etc.

    if (!apiKey) {
      console.warn('OPENAI_API_KEY not found. Using local fallback generator.');
      return NextResponse.json(generateLocalFallback(userProfile, topRecommendations));
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL || undefined,
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

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o', // or llama3-8b-8192 if groq
      messages: [
        { role: 'system', content: 'You are an expert AI EV Consultant. You return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const aiResult = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(aiResult);
    
  } catch (error) {
    console.error('API Error:', error);
    // Returning fallback if OpenAI fails
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateLocalFallback(userProfile: UserProfile, topRecommendations: RecommendationResult[]) {
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
