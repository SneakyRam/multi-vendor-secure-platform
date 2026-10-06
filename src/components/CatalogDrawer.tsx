import React, { useState } from 'react';
import { X, ShieldCheck, ArrowUpRight, Search } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { Product } from '../types';

interface CatalogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CatalogDrawer: React.FC<CatalogDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const allProducts = CATEGORIES.flatMap((c) => c.products);

  const filteredProducts = allProducts.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
        title="Click to close"
      />

      {/* Slide-over Drawer (Clean Luxury White Theme) */}
      <div className="relative z-10 w-full max-w-2xl bg-white border-l border-black/10 h-full flex flex-col shadow-2xl overflow-hidden text-[#0F172A]">
        
        {/* Header */}
        <div className="p-6 border-b border-black/10 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500">
                NEXORA CATALOG DIRECTORY
              </span>
            </div>
            <h2 className="font-brand font-extrabold text-2xl text-[#0F172A] tracking-tight mt-1">
              Select Product to Launch 3D Stage
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-black/10 flex items-center justify-center text-[#0F172A] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="p-6 border-b border-black/10 bg-neutral-50/60 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 20 verified assets by name, artisan, or spec..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-black/10 text-sm text-[#0F172A] placeholder-neutral-400 focus:outline-none focus:border-red-500 font-sans shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#0F172A] text-white font-bold'
                  : 'bg-white text-neutral-600 hover:text-black border border-black/10'
              }`}
            >
              All (20)
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#0F172A] text-white font-bold'
                    : 'bg-white text-neutral-600 hover:text-black border border-black/10'
                }`}
              >
                {cat.title} ({cat.products.length})
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => {
                onSelectProduct(prod);
                onClose();
              }}
              className="group relative rounded-2xl p-4 bg-neutral-50 hover:bg-neutral-100 border border-black/5 hover:border-black/20 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between shadow-sm"
            >
              {/* Top Row: Category tag and direct price */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  {prod.eyebrow}
                </span>
                <span className="text-xs font-mono font-extrabold text-[#0F172A]">
                  {prod.price}
                </span>
              </div>

              {/* Product Hero Thumbnail */}
              <div className="relative aspect-square w-full flex items-center justify-center my-2 overflow-hidden">
                <img
                  src={prod.hero}
                  alt={prod.name}
                  className="w-4/5 h-4/5 object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-108"
                />
              </div>

              {/* Product Title and Seller */}
              <div className="pt-2">
                <h3 className="font-brand font-bold text-sm text-[#0F172A] group-hover:text-red-600 transition-colors line-clamp-1">
                  {prod.name}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
                  <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-600 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#0F172A] flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Launch 3D Stage</span>
                    <ArrowUpRight className="w-3 h-3 text-red-500" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
