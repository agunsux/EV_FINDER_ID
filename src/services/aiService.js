export async function fetchAdvisor(payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

  try {
    const res = await fetch('/api/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('[DEBUG] AI Service Response Status:', res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${res.status}`);
    }

    const json = await res.json();
    if (!json.success) {
      console.error('[DEBUG] Backend error details:', json.debug);
      throw new Error(json.error || 'AI Advisor Error');
    }

    return json.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
