import { useState } from "react";
import { useEVAdvisor } from "../../features/ai/useEVAdvisor";

export default function AIAdvisorPanel({ vehicles }) {
  const { askEVAdvisor, loading, result } = useEVAdvisor();
  const [query, setQuery] = useState("");

  const handleAsk = async () => {
    await askEVAdvisor({
      vehicles,
      userQuery: query,
    });
  };

  return (
    <div className="mt-8 border border-white/10 p-6 rounded-xl bg-[#121212]">
      <h2 className="text-lg font-semibold mb-4">
        EV AI Advisor
      </h2>

      <textarea
        className="w-full bg-black border border-white/10 p-3 rounded-lg text-sm"
        placeholder="Contoh: EV terbaik untuk Jakarta harian 50km budget 400 juta"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleAsk}
        className="mt-3 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
      >
        Ask Antigravity
      </button>

      {loading && <p className="mt-3 text-sm opacity-60">Thinking...</p>}

      {result && (
        <div className="mt-5 whitespace-pre-wrap text-sm text-gray-300">
          {result.result}
        </div>
      )}
    </div>
  );
}
