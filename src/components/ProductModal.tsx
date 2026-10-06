import React, { useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ExternalLink, Sparkles, ArrowLeft } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  // Mock cryptographic hash for provenance demonstration
  const mockSha256 = `0x${product.id.split('').map((c) => c.charCodeAt(0).toString(16)).join('')}7f9a8b1c4e2d3f5a6b0c9e8d7c6b5a4`;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      {/* Clickable Semi-Transparent Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity cursor-pointer"
        title="Click anywhere to return to stage"
      />

      {/* Modal Container (Clean Luxury White Theme) */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-[#0F172A]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-mono font-bold text-slate-700 transition-all cursor-pointer"
              title="Return to 3D Stage"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Stage</span>
            </button>

            <span
              className="text-[11px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
              style={{
                borderColor: `${product.accent}40`,
                backgroundColor: `${product.accent}15`,
                color: product.accent,
              }}
            >
              {product.category.toUpperCase()}
            </span>
          </div>

          {/* Prominent Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-800 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          
          {/* Left Column: Hero & Floating Details Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-neutral-50 border border-slate-100 flex items-center justify-center p-6 overflow-hidden">
              <div
                className="absolute inset-0 rounded-full blur-[80px] opacity-15 pointer-events-none"
                style={{ backgroundColor: product.accent }}
              />
              <img
                src={product.hero}
                alt={product.name}
                className="w-4/5 h-4/5 object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]"
              />
            </div>

            {/* Isolated Detail Components */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                Isolated Component Assets ({product.details.length} Parts)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {product.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-neutral-50 border border-slate-100 flex flex-col items-center justify-center text-center group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-1">
                      <img
                        src={detail.src}
                        alt={detail.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-neutral-600 line-clamp-1">
                      {detail.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Identity, Cryptographic Trust & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                  {product.eyebrow}
                </span>
                <h3 className="font-brand font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight uppercase mt-0.5">
                  {product.name}
                </h3>
              </div>

              <div className="flex items-baseline space-x-3">
                <span className="font-mono text-3xl font-extrabold text-[#0F172A]">
                  {product.price}
                </span>
                <span className="text-xs font-mono text-emerald-600 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Escrow Reserved</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Artisan & Trust Parameters */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-100 space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-neutral-500">Merchant:</span>
                  <span className="text-[#0F172A] font-bold">{product.seller}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-neutral-500">Trust Protocol:</span>
                  <span className="text-emerald-700 font-semibold flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600 flex-shrink-0" />
                    <span>{product.trustLabel}</span>
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Asset Canvas:</span>
                  <span className="text-neutral-700">1024x1024 Transparent PNG</span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Proof (Clean White Architecture) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center space-x-1.5 text-emerald-700">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold uppercase tracking-wider">
                    Cryptographic Proof of Authenticity
                  </span>
                </div>
                <div className="text-slate-600 break-all select-all font-mono bg-white p-2 rounded-lg border border-slate-200">
                  # SHA-256: {mockSha256}
                </div>
                <div className="text-[9px] text-slate-500">
                  Digitally signed by merchant vault key. Guaranteed against unauthorized asset tampering.
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-brand font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Stage</span>
              </button>

              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 font-brand font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Add to Bag - {product.price}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
