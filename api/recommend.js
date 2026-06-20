import { getRecommendations } from '../server/services/recommendationEngine.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userProfile = req.body;
    
    if (!userProfile || !userProfile.budget || !userProfile.distance) {
      return res.status(400).json({ error: 'Invalid user profile' });
    }

    const recommendations = getRecommendations(userProfile);
    
    return res.status(200).json({
      recommendations
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
