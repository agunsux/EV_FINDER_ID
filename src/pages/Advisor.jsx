import React, { useState } from 'react';
import { fetchAdvisor } from '../services/aiService';
import { validateAdvisorResponse, getFallbackResponse } from '../utils/advisorValidator';
import { Sparkles, Send, Bot, User, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Advisor() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya AI Advisor EV Finder. Mari temukan mobil listrik yang paling cocok untuk Anda. Beritahu saya: Berapa budget Anda? Berapa jarak tempuh harian Anda? Dan bagaimana penggunaan utamanya (misal: keluarga, dalam kota, sering mudik)?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [structuredResult, setStructuredResult] = useState(null);

  // Simplified parsing for MVP: we ask user for structured inputs if we want, or just parse text loosely.
  // For this MVP, we'll extract numbers roughly or rely on a structured form.
  // Let's use a dual approach: Chat interface, but we extract profile from state.
  
  // Since the user asked for a conversational interface but our API needs structured data (`budget`, `distance`, etc.),
  // we'll simulate a conversational flow that builds the profile or we just parse it simply.
  // A robust implementation would use LLM function calling to extract `userProfile`.
  // Here, we'll use a regex/simple heuristic to extract budget and distance from the input string to demo.

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Very basic extraction for MVP purposes
      const budgetMatch = userMsg.match(/(\d+)\s*(juta|jt|milyar|m)/i);
      let budget = 500000000; // Default 500 jt
      if (budgetMatch) {
        let val = parseInt(budgetMatch[1]);
        if (budgetMatch[2].toLowerCase().startsWith('m')) val = val * 1000000000;
        else val = val * 1000000;
        budget = val;
      }

      const distanceMatch = userMsg.match(/(\d+)\s*km/i);
      let distance = 50; // Default 50km
      if (distanceMatch) distance = parseInt(distanceMatch[1]);

      const electricityMatch = userMsg.match(/(\d+)\s*va/i);
      let electricity = 2200;
      if (electricityMatch) electricity = parseInt(electricityMatch[1]);

      const payload = {
        budget,
        distance,
        electricity,
        usage: userMsg
      };

      const response = await fetchAdvisor(payload);
      
      let finalResult = response;
      if (!validateAdvisorResponse(response)) {
        finalResult = getFallbackResponse();
      }

      setStructuredResult(finalResult);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: finalResult.summary,
        isStructured: true
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Advisor sedang sibuk, coba lagi' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-blue-500" /> AI EV Advisor
        </h1>
        <p className="text-gray-400">Konsultasi cerdas untuk menemukan mobil listrik idaman Anda.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl p-5 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-[#1a1a1a] text-gray-200 border border-white/5 rounded-tl-sm'
              }`}>
                <p className="leading-relaxed">{msg.content}</p>

                {msg.isStructured && structuredResult && (
                  <div className="mt-6 space-y-6 border-t border-white/10 pt-6">
                    <h4 className="font-semibold text-white">Rekomendasi untuk Anda:</h4>
                    {structuredResult.recommendations.map((rec, rIdx) => (
                      <div key={rIdx} className="bg-[#0A0A0A] rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-bold text-lg text-blue-400">{rIdx + 1}. {rec.model}</h5>
                          {rec.score && (
                            <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                              Score: {rec.score}/100
                            </span>
                          )}
                        </div>
                        
                        {(rec.price || rec.range) && (
                          <div className="flex gap-4 mb-3 text-sm text-gray-300">
                            {rec.price && <div><span className="text-gray-500">Harga:</span> {rec.price}</div>}
                            {rec.range && <div><span className="text-gray-500">Jarak:</span> {rec.range}</div>}
                          </div>
                        )}
                        
                        <div className="space-y-2 mb-3">
                          {rec.why && rec.why.map((reason, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-green-500 mt-0.5">✓</span>
                              <p>{reason}</p>
                            </div>
                          ))}
                        </div>

                        {rec.warnings && rec.warnings.length > 0 && (
                          <div className="mt-3 bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                            {rec.warnings.map((warn, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-orange-400">
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p>{warn}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4 pt-3 border-t border-white/5 text-right">
                           <Link to="/vehicles" className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded transition-colors">
                             Lihat Detail Mobil &rarr;
                           </Link>
                        </div>
                      </div>
                    ))}

                    {structuredResult.next_questions && (
                      <div className="mt-6">
                        <p className="text-sm text-gray-400 mb-3">Anda mungkin ingin bertanya:</p>
                        <div className="flex flex-wrap gap-2">
                          {structuredResult.next_questions.map((q, i) => (
                            <button 
                              key={i}
                              onClick={() => setInput(q)}
                              className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-white/10">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-tl-sm p-5 flex flex-col gap-2">
                <p className="text-sm text-gray-300">AI sedang menganalisa EV terbaik...</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0A0A0A] border-t border-white/10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Contoh: Budget 500 juta, tiap hari jalan 50km, rumah 2200 VA..."
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-full pl-6 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 text-white ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
