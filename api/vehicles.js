import { getAllVehicles, getVehicleById } from '../server/services/recommendationEngine.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (id) {
      const vehicle = getVehicleById(id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      return res.status(200).json(vehicle);
    }

    const vehicles = getAllVehicles();
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
