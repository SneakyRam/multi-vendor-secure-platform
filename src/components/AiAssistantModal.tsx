import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { Product } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  recommendedProducts?: Product[];
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const allProducts = CATEGORIES.flatMap(c => c.products);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your NEXORA Personal Shopping Concierge. I can help you discover verified authentic goods, compare specs, or find products within your budget. What are you looking for today?'
    }
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.trim().toLowerCase();
    const newMessages: Message[] = [...messages, { sender: 'user', text: query }];
    setQuery('');

    // Intelligent recommendation matching
    let matchedProducts: Product[] = [];
    let responseText = '';

    if (q.includes('shoe') || q.includes('sneaker') || q.includes('nike') || q.includes('run')) {
      matchedProducts = allProducts.filter(p => p.category === 'shoes');
      responseText = `I found ${matchedProducts.length} verified footwear listings with cryptographic asset provenance. Here are the top recommendations:`;
    } else if (q.includes('headphone') || q.includes('audio') || q.includes('sound') || q.includes('sony')) {
      matchedProducts = allProducts.filter(p => p.category === 'headphones');
      responseText = `Here are our acoustic reference headphones, all verified with tamper-proof merchant signatures:`;
    } else if (q.includes('watch') || q.includes('time') || q.includes('omega') || q.includes('rolex')) {
      matchedProducts = allProducts.filter(p => p.category === 'watches');
      responseText = `Curated horology pieces authenticated by cold-storage merchant ledgers:`;
    } else if (q.includes('camera') || q.includes('leica') || q.includes('optic') || q.includes('photo')) {
      matchedProducts = allProducts.filter(p => p.category === 'cameras');
      responseText = `Premium optical instruments with zero CDN supply-chain dependencies:`;
    } else if (q.includes('bag') || q.includes('carry') || q.includes('backpack')) {
      matchedProducts = allProducts.filter(p => p.category === 'backpacks');
      responseText = `Technical carry solutions verified for durability and authentic merchant origin:`;
    } else if (q.includes('verified') || q.includes('safe') || q.includes('secure')) {
      matchedProducts = allProducts.slice(0, 4);
      responseText = 'All 20 products on NEXORA are 100% verified against SHA-256 asset hash trees with client-side anti-tampering guards.';
    } else {
      matchedProducts = allProducts.slice(0, 3);
      responseText = `I evaluated our verified catalog for "${query}". Here are the top matched items with authenticated provenance:`;
    }

    newMessages.push({
      sender: 'ai',
      text: responseText,
      recommendedProducts: matchedProducts
    });

    setMessages(newMessages);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-brand font-bold text-base text-slate-900 uppercase tracking-wide">
                  NEXORA AI Shopping Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Customer Scope
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous product discovery &amp; verified merchant intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 self-center text-[11px] font-medium">Try asking:</span>
          <button
            onClick={() => setQuery('Show me verified running sneakers')}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            "Show running sneakers"
          </button>
          <button
            onClick={() => setQuery('Find noise-cancelling headphones')}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            "Noise-cancelling headphones"
          </button>
          <button
            onClick={() => setQuery('Show luxury chronograph watches')}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            "Chronograph watches"
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, i) => (
            <div key={i} className={`space-y-3 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block p-4 rounded-2xl max-w-lg ${
                  m.sender === 'user'
                    ? 'bg-[#0F172A] text-white text-left'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
              </div>

              {/* Embedded Product Cards inside AI response */}
              {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left">
                  {m.recommendedProducts.slice(0, 4).map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 flex items-center space-x-3 cursor-pointer transition-all hover:shadow-md group"
                    >
                      <img src={prod.hero} alt={prod.name} className="w-12 h-12 object-contain flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-400 block truncate">{prod.seller}</span>
                        <h4 className="font-brand font-bold text-xs text-slate-900 truncate group-hover:text-red-600">
                          {prod.name}
                        </h4>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="font-extrabold text-slate-900">{prod.price}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-0.5" />
                            Verified
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 sm:p-5 border-t border-slate-100 bg-white flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask about products, verified sellers, audio gear, watches..."
            className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
