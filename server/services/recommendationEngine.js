import fs from 'fs';
import path from 'path';

// Use process.cwd() for Vercel serverless compatibility when reading static files
const vehiclesPath = path.join(process.cwd(), 'src', 'data', 'vehicles.json');
const rawData = fs.readFileSync(vehiclesPath, 'utf-8');
const rawVehicles = JSON.parse(rawData);

// Filter logic: ensure vehicle has required minimum fields
const vehicles = rawVehicles.filter(v => 
  v && v.id && v.brand && v.model && typeof v.price === 'number'
);

/**
 * Deterministic Recommendation Engine
 * Weights:
 * - Budget: 30%
 * - Range: 25%
 * - Usage: 20%
 * - Charging: 15%
 * - Service: 10%
 */
export function getRecommendations(userProfile) {
  const {
    budget,
    distance, // Daily distance in km
    usage,    // e.g., 'city', 'family', 'mudik', 'luxury'
    electricity, // Home electricity capacity in VA
  } = userProfile;

  const scoredVehicles = vehicles.map(vehicle => {
    let score = 0;
    const matchReasons = [];
    const warnings = [];

    // 1. Budget Score (30%)
    let budgetScore = 0;
    if (vehicle.price <= budget) {
      budgetScore = 100;
      matchReasons.push(`Harga masuk dalam budget (Sisa ${Math.floor((budget - vehicle.price)/1000000)} Juta).`);
    } else {
      // Penalty if over budget, scaling down to 0
      const overBudgetPct = (vehicle.price - budget) / budget;
      if (overBudgetPct <= 0.2) {
        budgetScore = 80 - (overBudgetPct * 400); // Gradual penalty
        warnings.push(`Sedikit di atas budget Anda (Lebih ${Math.floor((vehicle.price - budget)/1000000)} Juta).`);
      } else {
        budgetScore = 0;
        warnings.push(`Signifikan di atas budget Anda.`);
      }
    }

    // 2. Range Score (25%)
    let rangeScore = 0;
    const requiredRange = distance * 3; // buffer for 2-3 days without charge
    if (vehicle.rangeKm >= requiredRange) {
      rangeScore = 100;
      matchReasons.push(`Jarak tempuh ${vehicle.rangeKm}km sangat memadai untuk mobilitas harian Anda.`);
    } else if (vehicle.rangeKm >= distance) {
      rangeScore = 60;
      warnings.push(`Jarak tempuh ${vehicle.rangeKm}km cukup, namun perlu sering mengecas.`);
    } else {
      rangeScore = 0;
      warnings.push(`Jarak tempuh tidak disarankan untuk rute harian Anda.`);
    }

    // 3. Usage Match (20%)
    let usageScore = 50; // Base score
    const isFamily = usage?.toLowerCase().includes('family');
    const isCity = usage?.toLowerCase().includes('city');
    const isMudik = usage?.toLowerCase().includes('mudik');

    if (isFamily && (vehicle.bodyType === 'SUV' || vehicle.bodyType === 'MPV')) {
      usageScore = 100;
      matchReasons.push(`Bentuk ${vehicle.bodyType} sangat ideal untuk keluarga.`);
    } else if (isCity && vehicle.bodyType === 'Hatchback') {
      usageScore = 100;
      matchReasons.push(`Bodi kompak (Hatchback) cocok untuk manuver di kota.`);
    } else if (isMudik && vehicle.rangeKm >= 400 && vehicle.fastChargeTimeMins <= 30) {
      usageScore = 100;
      matchReasons.push(`Jarak jauh & fast charging ideal untuk mudik.`);
    } else {
      usageScore = 70;
    }

    // 4. Charging Score (15%)
    let chargingScore = 0;
    // Assume 2200VA allows max 2.2kW charging, maybe not ideal for large batteries
    const homeChargingTime = vehicle.batteryKwh / 2.2; 
    if (electricity < 2200) {
      chargingScore = 20;
      warnings.push(`Daya listrik rumah (${electricity} VA) mungkin kurang untuk home charging.`);
    } else if (electricity >= 2200 && electricity < 7700) {
      if (homeChargingTime > 24) {
        chargingScore = 50;
        warnings.push(`Baterai besar (${vehicle.batteryKwh} kWh) butuh waktu lama dicas dengan daya rumah Anda.`);
      } else {
        chargingScore = 80;
        matchReasons.push(`Bisa dicas di rumah dengan daya ${electricity} VA.`);
      }
    } else {
      chargingScore = 100;
      matchReasons.push(`Daya rumah sangat memadai untuk wall charger.`);
    }

    // Fast charging capability boosts score
    if (vehicle.fastChargeTimeMins && vehicle.fastChargeTimeMins <= 30) {
      chargingScore = Math.min(100, chargingScore + 20);
    }

    // 5. Service Network (10%)
    let serviceScore = 0;
    const strongServiceBrands = ['Hyundai', 'Wuling', 'Toyota', 'Nissan'];
    if (strongServiceBrands.includes(vehicle.brand)) {
      serviceScore = 100;
      matchReasons.push(`Jaringan bengkel ${vehicle.brand} tersebar luas.`);
    } else {
      serviceScore = 70;
      warnings.push(`Layanan purna jual ${vehicle.brand} sedang dalam tahap ekspansi.`);
    }

    score = (
      budgetScore * 0.30 +
      rangeScore * 0.20 +
      usageScore * 0.20 +
      chargingScore * 0.20 +
      serviceScore * 0.10
    );

    return {
      vehicle,
      score: Math.round(score),
      matchReasons,
      warnings
    };
  });

  // Sort by highest score
  const sorted = scoredVehicles.sort((a, b) => b.score - a.score);
  
  // Return Top 10
  return sorted.slice(0, 10);
}

export function getAllVehicles() {
  return vehicles;
}

export function getVehicleById(id) {
  return vehicles.find(v => v.id === id);
}
