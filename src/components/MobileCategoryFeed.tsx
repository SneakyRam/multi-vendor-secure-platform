import React from 'react';
import { ShieldCheck, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { Product } from '../types';

interface MobileCategoryFeedProps {
  onInspectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const MobileCategoryFeed: React.FC<MobileCategoryFeedProps> = ({
  onInspectProduct,
  onAddToCart,
}) => {
  return (
    <div className="md:hidden flex flex-col w-full bg-[#FFFFFF] divide-y divide-slate-100">
      {CATEGORIES.map((category, catIdx) => (
        <section
          key={category.id}
          id={`mobile-cat-${category.id}`}
          className="py-8 px-4 relative overflow-hidden"
          style={{ backgroundColor: `${category.accentColor}06` }}
        >
          {/* Category Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-red-600 font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                <span>0{catIdx + 1} // CHAPTER</span>
              </div>
              <h2 className="text-2xl font-black font-brand tracking-wider text-[#0F172A] uppercase mt-0.5">
                {category.title}
              </h2>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
              {category.products.length} Items
            </span>
          </div>

          <p className="text-xs text-slate-500 font-normal mb-5 leading-relaxed">
            {category.tagline}
          </p>

          {/* Horizontal Snap Scroll of All Products in this Category */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
            {category.products.map((product) => (
              <div
                key={product.id}
                className="snap-center shrink-0 w-[84vw] max-w-[320px] bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col justify-between"
              >
                {/* Top Badge: Eyebrow + Trust */}
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span
                    className="font-bold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${product.accent}15`,
                      color: product.accent,
                    }}
                  >
                    {product.eyebrow}
                  </span>
                  <span className="flex items-center text-emerald-700 font-semibold gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Hero Product Image */}
                <div
                  className="relative w-full aspect-square my-2 flex items-center justify-center cursor-pointer group"
                  onClick={() => onInspectProduct(product)}
                >
                  <div
                    className="absolute inset-4 rounded-full blur-[40px] opacity-20 pointer-events-none"
                    style={{ backgroundColor: product.accent }}
                  />
                  <img
                    src={product.hero}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)] active:scale-95 transition-transform"
                    loading="lazy"
                  />
                </div>

                {/* Product Metadata */}
                <div className="space-y-1 mt-2">
                  <h3
                    className="text-base font-black font-brand tracking-wide text-[#0F172A] uppercase line-clamp-1 cursor-pointer"
                    onClick={() => onInspectProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="text-[10px] font-mono text-slate-400 pt-1">
                    Seller: <span className="font-semibold text-slate-700">{product.seller}</span>
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-lg font-mono font-extrabold text-[#0F172A] tracking-tight">
                    {product.price}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onInspectProduct(product)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Inspect Cryptographic Dossier"
                    >
                      <Layers className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-brand font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
