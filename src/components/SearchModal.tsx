import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Shield, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  // Sanitize search query against XSS & script tags
  const sanitizedQuery = useMemo(() => {
    return query
      .replace(/[<>'"`;()]/g, '')
      .trim()
      .slice(0, 50);
  }, [query]);

  // Flatten all products
  const allProducts = useMemo(() => {
    return CATEGORIES.flatMap((c) => c.products);
  }, []);

  const results = useMemo(() => {
    if (!sanitizedQuery) return [];
    const q = sanitizedQuery.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q) ||
        p.displayWord.toLowerCase().includes(q)
    );
  }, [sanitizedQuery, allProducts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-20 sm:pt-28 px-4 animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        title="Click to close"
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white border border-black/10 shadow-2xl p-4 sm:p-6 text-[#0F172A]">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-black/10 pb-4">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shoes, headphones, watches, cameras, packs..."
            autoFocus
            maxLength={50}
            className="w-full bg-transparent text-base sm:text-lg text-[#0F172A] placeholder-neutral-400 focus:outline-none font-normal"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-black mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black text-xs font-mono font-bold cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Security Notice */}
        <div className="py-2 flex items-center space-x-1.5 text-[10px] font-mono text-emerald-700 border-b border-black/5">
          <Shield className="w-3 h-3 text-emerald-600" />
          <span>Input strictly sanitized for Cross-Site Scripting (XSS) prevention</span>
        </div>

        {/* Results List */}
        <div className="mt-4 max-h-[50vh] overflow-y-auto space-y-2">
          {sanitizedQuery && results.length === 0 && (
            <div className="py-8 text-center text-neutral-500 text-sm">
              No verified marketplace products found for &ldquo;{sanitizedQuery}&rdquo;
            </div>
          )}

          {!sanitizedQuery && (
            <div className="py-6 px-2 text-xs text-neutral-500 font-mono space-y-2">
              <span className="block uppercase tracking-widest text-neutral-400 mb-2 font-bold">
                Suggested Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Chicago Jordan', 'Open-Back', 'Chronograph', 'Mirrorless 8K', 'Cordura Travel'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black transition-colors border border-black/5 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onSelectProduct(product);
                onClose();
              }}
              className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-black/5 hover:border-black/15 flex items-center justify-between cursor-pointer group transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-black/5 shrink-0">
                  <img
                    src={product.hero}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="font-brand font-bold text-sm text-[#0F172A] group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-500">
                    <span className="uppercase">{product.category}</span>
                    <span>•</span>
                    <span>{product.seller}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-[#0F172A]">
                  {product.price}
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
