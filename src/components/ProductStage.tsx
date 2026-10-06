import React, { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Layers, ShoppingBag } from 'lucide-react';
import gsap from 'gsap';
import { CategoryChapter, Product } from '../types';

interface ProductStageProps {
  category: CategoryChapter;
  product: Product;
  productIndex: number;
  onSelectProductIndex: (index: number) => void;
  onInspectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenCatalog: () => void;
}

interface FloatPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
  anim: string;
}

// 4 distinct orbital placements for floating detail transparent PNGs (Far right flank - 0% collision with hero)
const FLOAT_POSITIONS: FloatPosition[] = [
  { top: '12%', right: '3.5%', rotate: -6, anim: 'orbit-a' },
  { top: '35%', right: '2%', rotate: 8, anim: 'orbit-b' },
  { top: '58%', right: '2.5%', rotate: -5, anim: 'orbit-a' },
  { bottom: '14%', right: '4%', rotate: 6, anim: 'orbit-b' },
];

export const ProductStage: React.FC<ProductStageProps> = ({
  category,
  product,
  productIndex,
  onSelectProductIndex,
  onInspectProduct,
  onAddToCart,
  onOpenCatalog,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const floatsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<'next' | 'prev'>('next');

  // Ponytail: Fast small-to-big zoom in 3D perspective animation per user showcase request
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const isNext = directionRef.current === 'next';
    const startRot = isNext ? 14 : -14;
    const startX = isNext ? 120 : -120;

    // Kill any in-flight tweens to prevent stutter
    if (heroImgRef.current) gsap.killTweensOf(heroImgRef.current);
    if (bgTextRef.current) gsap.killTweensOf(bgTextRef.current);
    if (floatsRef.current?.children) gsap.killTweensOf(floatsRef.current.children);
    if (infoRef.current) gsap.killTweensOf(infoRef.current);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Dominant hero bursts in FAST from SMALL to BIG (explosive zoom in)
    if (heroImgRef.current) {
      tl.fromTo(
        heroImgRef.current,
        { scale: 0.15, opacity: 0, x: startX, rotation: startRot, filter: 'blur(8px)' },
        { scale: 1, opacity: 1, x: 0, rotation: 0, filter: 'blur(0px)', duration: 0.45, ease: 'back.out(1.25)' },
        0
      );
    }

    // 2. Giant background word zooms in from deep perspective
    if (bgTextRef.current) {
      tl.fromTo(
        bgTextRef.current,
        { scale: 0.45, opacity: 0, x: startX * 0.3 },
        { scale: 1, opacity: 1, x: 0, duration: 0.48, ease: 'power2.out' },
        0
      );
    }

    // 3. Floating detail assets burst outward radially from small to full orbit
    if (floatsRef.current) {
      tl.fromTo(
        floatsRef.current.children,
        { scale: 0.1, opacity: 0, y: isNext ? 35 : -35 },
        { scale: 1, opacity: 1, y: 0, duration: 0.42, stagger: 0.04, ease: 'back.out(1.3)' },
        0.06
      );
    }

    // 4. Product metadata slides up smoothly
    if (infoRef.current) {
      tl.fromTo(
        infoRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
        0.08
      );
    }
  }, [product.id]);

  const handleNext = () => {
    directionRef.current = 'next';
    const next = (productIndex + 1) % category.products.length;
    onSelectProductIndex(next);
  };

  const handlePrev = () => {
    directionRef.current = 'prev';
    const prev = (productIndex - 1 + category.products.length) % category.products.length;
    onSelectProductIndex(prev);
  };

  // Touch swipe support for smooth mobile interaction (left/right product flipping)
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    
    // Only flip if horizontal swipe is significantly stronger than vertical scroll
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [productIndex, category.products.length]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="cinematic-stage-wrap select-none"
      style={{ backgroundColor: product.background }}
    >
      {/* Subtle Vignette */}
      <div className="stage-vignette" />

      {/* MONUMENTAL BACKGROUND TYPOGRAPHY (Behind Product) */}
      <div
        ref={bgTextRef}
        className="slider-bg-word"
      >
        {product.displayWord}
      </div>

      {/* RAW FLOATING DETAIL ASSETS (Isolated Transparent PNGs - Desktop Only) */}
      <div
        ref={floatsRef}
        className="hidden md:block absolute inset-0 z-20 pointer-events-none"
      >
        {product.details.map((detail, idx) => {
          const pos = FLOAT_POSITIONS[idx % FLOAT_POSITIONS.length];
          return (
            <div
              key={`${product.id}-detail-${idx}`}
              className={`stage-float-item ${pos.anim} group pointer-events-auto`}
              style={{
                top: pos.top,
                bottom: pos.bottom,
                left: pos.left,
                right: pos.right,
                transform: `rotate(${pos.rotate}deg)`,
              }}
              title={detail.name}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 transition-all duration-300">
                <img
                  src={detail.src}
                  alt={detail.name}
                  loading="eager"
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)]"
                />

                {/* Hover Label Pill */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 border border-black/10 text-[9px] font-mono text-[#0F172A] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md">
                    {detail.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DOMINANT CENTER HERO PRODUCT */}
      <div
        className="hero-stage-item"
      >
        <img
          ref={heroImgRef}
          src={product.hero}
          alt={product.name}
          className="hero-img"
        />
      </div>

      {/* PRODUCT METADATA & ACTIONS (Desktop Lower-Left, Mobile Clean Centered) */}
      <div ref={infoRef} className="slide-info-panel">
        <div className="flex items-center justify-center md:justify-start space-x-2.5 mb-2.5">
          <span
            className="text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border shadow-2xs backdrop-blur-sm"
            style={{
              borderColor: `${product.accent}40`,
              backgroundColor: `${product.accent}12`,
              color: product.accent,
            }}
          >
            {category.title} // {product.eyebrow}
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-medium">
            {product.id}
          </span>
        </div>

        <h2 className="slide-title-text">
          {product.name}
        </h2>

        <p className="slide-tagline-text line-clamp-2">
          {product.description}
        </p>

        {/* Vendor Trust & Verification Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-4 text-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 border border-slate-200/90 shadow-2xs backdrop-blur-sm text-slate-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900">{product.seller}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-[11px] font-mono font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>{product.trustLabel}</span>
          </div>
        </div>

        {/* Sleek Luxury Actions Group */}
        <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
          <button
            onClick={() => onAddToCart(product)}
            className="h-12 px-6 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-brand font-semibold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2.5 active:scale-98 cursor-pointer group"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Add to Bag</span>
            <span className="text-white/20 font-light">|</span>
            <span className="font-mono text-emerald-300 font-bold">{product.price}</span>
          </button>

          <button
            onClick={() => onInspectProduct(product)}
            className="h-12 px-5 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-800 text-xs font-mono font-medium uppercase tracking-wider transition-all duration-200 shadow-sm hover:border-slate-300 hover:shadow-md flex items-center gap-2 active:scale-98 cursor-pointer backdrop-blur-md"
            title="Inspect Cryptographic Security Dossier"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Dossier</span>
          </button>
        </div>
      </div>

      {/* BOTTOM-CENTER: CIRCULAR NAVIGATION BUTTONS (Matching Video) */}
      <div className="slider-arrows-nav">
        <button
          onClick={handlePrev}
          aria-label="Previous product"
          className="snav-circle-btn cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next product"
          className="snav-circle-btn next-btn cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* BOTTOM-RIGHT: SLIDE COUNTER & INTERACTIVE LINE INDICATORS */}
      <div className="slide-counter-panel">
        <span className="counter-num-text">
          0{productIndex + 1} / 0{category.products.length}
        </span>
        <div className="counter-dots-wrap">
          {category.products.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => onSelectProductIndex(idx)}
              className={`counter-line-dot ${idx === productIndex ? 'active' : ''}`}
              title={`View ${p.name}`}
            />
          ))}
        </div>
      </div>

      {/* Sleek Mobile Scroll Indicator Hint (Guides mobile shoppers down into category collections) */}
      <div className="md:hidden flex flex-col items-center mt-5 mb-2 text-slate-400 animate-bounce pointer-events-none select-none">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500">
          Scroll for All Collections
        </span>
        <svg className="w-4 h-4 mt-0.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};
