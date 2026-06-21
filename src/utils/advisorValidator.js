export function validateAdvisorResponse(response) {
  if (!response) return false;
  if (typeof response.summary !== 'string' || response.summary.trim() === '') return false;
  if (!Array.isArray(response.recommendations) || response.recommendations.length === 0) return false;

  for (const rec of response.recommendations) {
    if (!rec.model || typeof rec.model !== 'string') return false;
    if (!Array.isArray(rec.why) || rec.why.length === 0) return false;
  }

  return true;
}

export function getFallbackResponse() {
  return {
    summary: "Maaf, sistem AI kami sedang tidak bisa memberikan analisis mendalam saat ini. Namun, kami merekomendasikan opsi terbaik berdasarkan budget dan kebutuhan Anda secara langsung.",
    recommendations: [
      {
        model: "Rekomendasi Berdasarkan Budget",
        price: "Hubungi Dealer",
        range: "-",
        score: 80,
        why: ["Mobil ini paling sesuai dengan parameter dasar pencarian Anda."]
      }
    ]
  };
}
