import { getRecommendations } from '../server/services/recommendationEngine.js';
import { generateAdvisorResponse } from '../server/services/aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userProfile = req.body;

    if (!userProfile || !userProfile.budget || !userProfile.distance) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Step 1: Run deterministic scoring engine to get top vehicles securely
    const topRecommendations = getRecommendations(userProfile);

    // Step 2: Feed deterministic data and user profile to AI for personalized response
    const aiResponse = await generateAdvisorResponse(userProfile, topRecommendations);

    res.status(200).json(aiResponse);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
