# EV Database Schema Notes

This document tracks the future fields to be added to the EV vehicle database (`vehicles.json`) to support advanced features, comparisons, and filtering.

## Current Schema (MVP)
- `id` (String): Unique identifier
- `brand` (String): Manufacturer brand
- `model` (String): Vehicle model
- `price` (Number): Price in IDR
- `priceFormatted` (String): Formatted price for display
- `rangeKm` (Number): Estimated WLTP/NEDC range in km
- `batteryKwh` (Number): Battery capacity in kWh
- `fastChargeTimeMins` (Number | null): DC fast charging time (10% - 80%)
- `bodyType` (String): SUV, Hatchback, Sedan, etc.
- `image` (String): URL to vehicle image

## Future Fields to Add

### Interior & Capacity
- `seats` (Number): Number of passenger seats
- `cargo_liter` (Number): Total cargo/trunk capacity in liters

### Dimensions & Terrain
- `ground_clearance_mm` (Number): Ground clearance in millimeters (crucial for Indonesian roads)
- `flood_rating` (String/Number): Safe wading depth or IP rating for water exposure

### Performance
- `motor_power_hp` (Number): Electric motor power output in Horsepower
- `torque_nm` (Number): Instant torque output in Nm

### Advanced Features
- `adas` (Boolean/String): Presence and level of Advanced Driver Assistance Systems
- `v2l` (Boolean): Vehicle-to-Load capability (ability to power external devices)

### Ownership & Economy
- `maintenance_cost_year` (Number): Estimated annual maintenance cost in IDR
- `resale_score` (Number): 1-100 score estimating value retention
