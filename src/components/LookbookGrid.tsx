import React, { useState } from 'react';
import { Layers, Sparkles, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { Product } from '../types';

interface LookbookGridProps {
  onLaunchStage: (product: Product) => void;
  onInspectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const LookbookGrid: React.FC<LookbookGridProps> = ({
  onLaunchStage,
  onInspectProduct,
  onAddToCart,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const allProducts = CATEGORIES.flatMap((c) => c.products);

  const filtered = activeFilter === 'all'
    ? allProducts
    : allProducts.filter((p) => p.category === activeFilter);

  return (
    <section className="w-full py-28 px-6 sm:px-12 lg:px-20 bg-[#F8F9FA] border-t border-slate-200/80 relative select-none text-[#0F172A] flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto space-y-12">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-500 block mb-1">
              Curated Multi-Vendor Archive
            </span>
            <h2 className="font-brand font-black text-3xl sm:text-5xl tracking-tight uppercase text-[#0F172A] leading-none">
              The NEXORA Catalog
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All (20)' },
              { id: 'shoes', label: 'Shoes (4)' },
              { id: 'headphones', label: 'Audio (4)' },
              { id: 'watches', label: 'Watches (4)' },
              { id: 'cameras', label: 'Optics (4)' },
              { id: 'backpacks', label: 'Carry (4)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#0F172A] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200 shadow-xs'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-400 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-xl"
            >
              {/* Image Stage */}
              <div
                className="relative aspect-square w-full rounded-2xl bg-slate-50 p-4 flex items-center justify-center overflow-hidden cursor-pointer mb-4 group/img border border-slate-100"
                onClick={() => onLaunchStage(product)}
                title="Launch in 3D Cinematic Stage"
              >
                <div
                  className="absolute inset-0 rounded-full blur-[60px] opacity-10 pointer-events-none transition-colors"
                  style={{ backgroundColor: product.accent }}
                />
                <img
                  src={product.hero}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.12)] group-hover/img:scale-108 transition-transform duration-300"
                />

                <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-white/95 border border-slate-200 text-[10px] font-semibold text-slate-700 uppercase tracking-wider backdrop-blur-md shadow-xs">
                  {product.category}
                </span>

                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                  <span className="px-4 py-2 rounded-full bg-white text-[#0F172A] font-brand font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-xl">
                    <span>Open 3D Stage</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Text Meta */}
              <div className="space-y-1 mb-4">
                <span className="text-xs font-medium text-slate-500 block truncate">
                  {product.eyebrow}
                </span>
                <h4
                  onClick={() => onLaunchStage(product)}
                  className="font-brand font-bold text-lg text-[#0F172A] tracking-tight uppercase line-clamp-1 group-hover:text-red-600 transition-colors cursor-pointer"
                >
                  {product.name}
                </h4>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-brand text-lg font-extrabold text-[#0F172A]">
                    {product.price}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 flex-shrink-0" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onLaunchStage(product)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-xs font-semibold text-[#0F172A] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>3D Stage</span>
                </button>

                <button
                  onClick={() => onInspectProduct(product)}
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-black/5 text-neutral-600 hover:text-black transition-all cursor-pointer"
                  title="View Cryptographic Dossier"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onAddToCart(product)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-brand font-bold flex items-center justify-center space-x-1 transition-all shadow-sm cursor-pointer active:scale-95"
                  title="Add to Bag"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bag</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
