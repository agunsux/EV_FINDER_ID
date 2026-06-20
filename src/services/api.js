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

export async function fetchAdvisor(payload) {
  const res = await fetch('/api/advisor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to fetch advisor');
  return res.json();
}
