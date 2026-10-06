import React, { useState } from 'react';
import { ShieldCheck, Check, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { CategoryChapter, Product } from '../types';

interface CategoryDetailSectionProps {
  category: CategoryChapter;
  onInspectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CategoryDetailSection: React.FC<CategoryDetailSectionProps> = ({
  category,
  onInspectProduct,
  onAddToCart,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeProduct = category.products[selectedIdx];

  return (
    <section
      id={category.id}
      className="py-24 px-4 sm:px-8 lg:px-12 border-t border-white/10 relative overflow-hidden"
      style={{ backgroundColor: '#090a0d' }}
    >
      {/* Ambient glow matching category accent */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ backgroundColor: category.accentColor }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono tracking-[0.2em] text-red-500 uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{category.index} • ARCHIVE DOSSIER</span>
            </div>
            <h2 className="font-['Bebas_Neue'] text-4xl sm:text-6xl tracking-wide uppercase text-white leading-none">
              {category.title}
            </h2>
            <p className="text-sm text-neutral-400 max-w-lg mt-2 font-normal">
              {category.tagline}
            </p>
          </div>

          {/* Product Thumbnail Selector Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
            {category.products.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedIdx(idx)}
                className={`relative p-2 rounded-xl border transition-all duration-200 shrink-0 ${
                  idx === selectedIdx
                    ? 'border-white bg-white/15 scale-105 shadow-xl shadow-white/10'
                    : 'border-white/10 bg-neutral-900/60 hover:border-white/30'
                }`}
                style={{ width: '68px', height: '68px' }}
                title={p.name}
              >
                <img
                  src={p.hero}
                  alt={p.name}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
                {idx === selectedIdx && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-black" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Split: Left Big Stage / Right Component Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Product Stage */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative p-8 sm:p-12 rounded-3xl bg-neutral-950/80 border border-white/10 overflow-hidden shadow-2xl">
            {/* Monumental background text watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-10">
              <span className="font-['Bebas_Neue'] text-[16vw] text-white tracking-tighter">
                {activeProduct.displayWord}
              </span>
            </div>

            {/* Hero Image */}
            <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center group cursor-pointer" onClick={() => onInspectProduct(activeProduct)}>
              <div
                className="absolute inset-0 rounded-full blur-[80px] opacity-25 pointer-events-none transition-colors duration-500"
                style={{ backgroundColor: activeProduct.accent }}
              />
              <img
                src={activeProduct.hero}
                alt={activeProduct.name}
                className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Bottom Eyebrow & Price */}
            <div className="w-full flex items-center justify-between pt-6 border-t border-white/10 text-xs font-mono">
              <span className="text-neutral-400">{activeProduct.eyebrow}</span>
              <span className="text-white font-extrabold text-lg">{activeProduct.price}</span>
            </div>
          </div>

          {/* Right Column: Spec Breakdown & Floating Parts */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{activeProduct.trustLabel}</span>
              </div>
              <h3 className="font-['Bebas_Neue'] text-3xl sm:text-5xl uppercase text-white tracking-wide leading-none">
                {activeProduct.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed">
                {activeProduct.description}
              </p>
            </div>

            {/* Isolated Detail Parts */}
            <div>
              <h4 className="text-xs font-mono tracking-widest uppercase text-neutral-400 mb-3 flex items-center justify-between">
                <span>Isolated Component Assets</span>
                <span className="text-[10px] text-white/50">{activeProduct.details.length} PARTS</span>
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                {activeProduct.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3 group hover:border-white/30 transition-all cursor-pointer"
                    onClick={() => onInspectProduct(activeProduct)}
                  >
                    <div className="w-12 h-12 rounded-lg bg-black/40 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={detail.src}
                        alt={detail.name}
                        className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-medium text-white truncate block">
                        {detail.name}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">
                        Transparent PNG
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Merchant Info */}
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Curator / Merchant:</span>
              <span className="text-white font-medium">{activeProduct.seller}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => onAddToCart(activeProduct)}
                className="flex-1 py-3.5 rounded-full bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-white/10"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Add to Bag — {activeProduct.price}</span>
              </button>

              <button
                onClick={() => onInspectProduct(activeProduct)}
                className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
