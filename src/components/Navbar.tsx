import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, ShieldCheck, Grid, Menu, X, Bot } from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface NavbarProps {
  activeCategory: string;
  cartCount: number;
  currentRole?: 'customer' | 'vendor' | 'admin';
  onSelectRole?: (role: 'customer' | 'vendor' | 'admin') => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenCatalog: () => void;
  onOpenAi?: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  cartCount,
  currentRole = 'customer',
  onSelectRole,
  onOpenSearch,
  onOpenCart,
  onOpenCatalog,
  onOpenAi,
  onSelectCategory,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (id: string) => {
    if (currentRole !== 'customer' && onSelectRole) {
      onSelectRole('customer');
    }
    onSelectCategory(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`nexora-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Brand Logo & Name + Role Switcher */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div
          className="nav-brand-title"
          onClick={() => {
            if (onSelectRole) onSelectRole('customer');
            onSelectCategory('shoes');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="NEXORA — A Security-First Multi-Vendor Marketplace"
        >
          <span>NEXORA</span>
          <span className="dot">•</span>
        </div>

        {/* Triple-Experience Segmented Role Switcher */}
        {onSelectRole && (
          <div className="hidden md:flex items-center p-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => { onSelectRole('customer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                currentRole === 'customer'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Storefront
            </button>
            <button
              onClick={() => { onSelectRole('vendor'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                currentRole === 'vendor'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Vendor
            </button>
            <button
              onClick={() => { onSelectRole('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-[#0F172A] text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Admin Risk
            </button>
          </div>
        )}
      </div>

      {/* Category Pills (Center Desktop - Active in Customer Mode) */}
      {currentRole === 'customer' ? (
        <nav className="hidden xl:flex nav-category-pills">
          {CATEGORIES.map((cat, idx) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`nav-cat-btn ${isActive ? 'active' : ''}`}
              >
                0{idx + 1}. {cat.title}
              </button>
            );
          })}
        </nav>
      ) : (
        <div className="hidden xl:flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            {currentRole === 'vendor' ? 'Authorized Merchant Workspace' : 'Sovereign Threat Sentinel'}
          </span>
        </div>
      )}

      {/* Right Actions - Guaranteed fit without horizontal overflow */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Catalog Trigger */}
        <button
          onClick={onOpenCatalog}
          className="px-2.5 sm:px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-black/10 text-xs font-mono font-bold text-[#0F172A] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
          title="Browse All 20 Verified Products"
        >
          <Grid className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
          <span className="hidden sm:inline">Catalog (20)</span>
        </button>

        {/* AI Shopping Concierge Trigger */}
        {onOpenAi && (
          <button
            onClick={onOpenAi}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold text-indigo-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
            title="Ask NEXORA AI Shopping Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        )}

        {/* Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="px-2.5 sm:px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-black/10 text-xs font-mono text-neutral-700 hover:text-black flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
          title="Search Catalog (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline text-neutral-500 text-[11px]">Search</span>
        </button>

        {/* Shopping Bag Trigger */}
        <button
          onClick={onOpenCart}
          className="relative px-3 sm:px-3.5 py-1.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-1.5 sm:gap-2 transition-all shadow-md cursor-pointer active:scale-95 shrink-0"
          title="Shopping Bag"
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline font-brand font-bold text-xs uppercase tracking-wider">Bag</span>
          {cartCount > 0 && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-500 text-white font-mono">
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-neutral-700 hover:text-black bg-neutral-100 border border-black/10 shrink-0"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-black/10 p-5 space-y-2 shadow-2xl">
          <div className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase mb-2">
            Categories
          </div>
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="w-full text-left px-4 py-2.5 rounded-xl font-brand font-bold text-lg tracking-wider uppercase text-neutral-700 hover:text-black hover:bg-neutral-100 flex items-center justify-between transition-colors"
            >
              <span>0{idx + 1}. {cat.title}</span>
              <span className="text-xs font-mono text-neutral-400">{cat.products.length} Items</span>
            </button>
          ))}

          <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCatalog();
              }}
              className="w-full py-2.5 rounded-xl bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-brand font-bold text-xs uppercase tracking-wider text-center cursor-pointer"
            >
              Open 20-Product Catalog
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
