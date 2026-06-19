// Temporary: pakai localStorage dulu (ganti ke Firebase nanti)
export function saveLead(leadData) {
  const leads = JSON.parse(localStorage.getItem('evfinder_leads') || '[]');
  const newLead = {
    ...leadData,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    source: 'calculator',
    model: leadData.model || 'unknown',
  };
  leads.push(newLead);
  localStorage.setItem('evfinder_leads', JSON.stringify(leads));
  return newLead;
}

export function getLeads() {
  return JSON.parse(localStorage.getItem('evfinder_leads') || '[]');
}
