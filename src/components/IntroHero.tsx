import React from 'react';
import { ArrowDown, Shield, Cpu, Lock } from 'lucide-react';

interface IntroHeroProps {
  onExplore: () => void;
}

export const IntroHero: React.FC<IntroHeroProps> = ({ onExplore }) => {
  return (
    <section className="relative min-h-[82vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 overflow-hidden text-center select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-gradient-to-tr from-red-600/15 via-neutral-900 to-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Eyebrow Tag */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[11px] font-mono tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
        <span>NEXORA INDEPENDENT COMMERCE</span>
        <span className="text-neutral-600">|</span>
        <span>20 ICONIC PRODUCTS</span>
      </div>

      {/* Monumental Headline in Bebas Neue */}
      <h1 className="max-w-4xl mx-auto font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-8xl tracking-[0.04em] uppercase text-white leading-[0.92] mb-6">
        Discover a Marketplace<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
          Built for Trust.
        </span>
      </h1>

      {/* Editorial Subheading */}
      <p className="max-w-xl mx-auto text-xs sm:text-base text-neutral-400 font-normal leading-relaxed mb-8">
        Products from independent sellers, presented like products worth discovering.
        Cinematographic clarity, isolated floating components, and cryptographic provenance.
      </p>

      {/* Trust & Architecture Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10 max-w-2xl">
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-neutral-900/80 border border-white/10 text-[11px] text-neutral-300 font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Tamper Assets</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-neutral-900/80 border border-white/10 text-[11px] text-neutral-300 font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hardware Isolated</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-neutral-900/80 border border-white/10 text-[11px] text-neutral-300 font-mono">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>CSP Strict Level 3</span>
        </div>
      </div>

      {/* Primary CTA Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={onExplore}
          className="group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-white text-black font-bold text-xs font-mono tracking-widest uppercase hover:bg-neutral-200 transition-all duration-300 hover:scale-105 shadow-xl shadow-white/10"
        >
          <span>Explore Showcase</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-1" />
        </button>
      </div>

      {/* Scroll Hint */}
      <div className="mt-12 flex flex-col items-center space-y-1.5 opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent" />
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400">
          SCROLL TO EXPLORE
        </span>
      </div>
    </section>
  );
};
