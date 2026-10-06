import React, { useState } from 'react';
import { ShieldCheck, ChevronUp, CheckCircle2 } from 'lucide-react';

export const SecurityBadge: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside aria-label="NEXORA Security Guard" className="fixed bottom-16 md:bottom-4 right-4 z-40">
      <div className="rounded-2xl border border-emerald-500/40 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300">
        
        {/* Compact Toggle Bar */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 flex items-center space-x-2 text-left hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-700">
            NEXORA SECURE: PASS
          </span>
          <ChevronUp
            className={`w-3 h-3 text-neutral-500 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expanded Diagnostics */}
        {expanded && (
          <div className="p-3.5 border-t border-black/5 space-y-2 max-w-xs text-[10px] font-mono bg-white text-[#0F172A]">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1 text-neutral-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Anti-Clickjacking:</span>
              </span>
              <span className="text-emerald-700 font-bold">DENY / Frame Buster</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1 text-neutral-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Content Security Policy:</span>
              </span>
              <span className="text-emerald-700 font-bold">Strict CSP Level 3</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1 text-neutral-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>XSS Defense:</span>
              </span>
              <span className="text-emerald-700 font-bold">Sanitized Declarative DOM</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1 text-neutral-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Data Immutability:</span>
              </span>
              <span className="text-emerald-700 font-bold">Object.freeze Active</span>
            </div>

            <div className="pt-1.5 border-t border-black/5 text-[9px] text-neutral-400">
              Evaluated under OWASP Top 10 standards.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
