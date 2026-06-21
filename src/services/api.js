export async function fetchVehicles() {
  const res = await fetch('/api/vehicles');
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

export async function fetchVehicleById(id) {
  const res = await fetch(`/api/vehicles?id=${id}`);
  if (!res.ok) throw new Error('Failed to fetch vehicle');
  return res.json();
}
