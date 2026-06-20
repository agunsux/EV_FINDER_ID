export interface EVModel {
  id: string; // e.g., 'hyundai-ioniq-5'
  brand: string;
  model: string;
  year: number;
  price_range: {
    min: number;
    max: number;
  };
  priceFormatted?: string; // Legacy support
  battery_capacity: number; // kWh
  range_claimed: number; // km
  range_real_world: number; // km
  charging_time: {
    ac: number; // hours
    dc: number | null; // hours
  };
  fastChargeTimeMins?: number | null; // Legacy support
  motor_power: number; // kW
  torque: number; // Nm
  seating_capacity: number;
  cargo_volume: number; // Liters
  ground_clearance: number; // mm
  warranty: {
    years: number;
    km: number;
  };
  made_in: string;
  images: string[];
  official_website: string;
  dealer_network: string[]; // Cities
  incentives: string[];
  category: 'suv' | 'sedan' | 'hatchback' | 'mpv' | 'commercial';
  tags: string[]; // e.g., ['family', 'commuter', 'luxury', 'budget', 'performance']
  
  // Legacy original fields preserved
  pros: string[];
  cons: string[];
  suitability: string[];
  service_center: string;
  bodyType?: string; // Legacy support
}
