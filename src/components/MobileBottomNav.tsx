import React from 'react';
import { Home, Search, ShoppingBag, Store, ShieldAlert } from 'lucide-react';

interface MobileBottomNavProps {
  currentRole: 'customer' | 'vendor' | 'admin';
  cartCount: number;
  onSelectRole: (role: 'customer' | 'vendor' | 'admin') => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onScrollToTop: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  cartCount,
  onSelectRole,
  onOpenSearch,
  onOpenCart,
  onScrollToTop,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/92 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-around select-none">
      
      {/* 1. Storefront Home */}
      <button
        onClick={() => {
          onSelectRole('customer');
          onScrollToTop();
        }}
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] rounded-xl transition-all cursor-pointer ${
          currentRole === 'customer'
            ? 'text-[#0F172A]'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className={`w-5 h-5 ${currentRole === 'customer' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className={`text-[10px] tracking-tight mt-0.5 ${currentRole === 'customer' ? 'font-bold text-[#0F172A]' : 'font-medium'}`}>
          Store
        </span>
        {currentRole === 'customer' && (
          <span className="w-1 h-1 rounded-full bg-[#0F172A] mt-0.5" />
        )}
      </button>

      {/* 2. Real-time Search */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center min-w-[54px] min-h-[48px] rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
      >
        <Search className="w-5 h-5 stroke-2" />
        <span className="text-[10px] font-medium tracking-tight mt-0.5">
          Search
        </span>
      </button>

      {/* 3. Escrow Shopping Bag */}
      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center justify-center min-w-[54px] min-h-[48px] rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 stroke-2" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-tight mt-0.5">
          Bag
        </span>
      </button>

      {/* 4. Vendor Portal */}
      <button
        onClick={() => {
          onSelectRole('vendor');
          onScrollToTop();
        }}
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] rounded-xl transition-all cursor-pointer ${
          currentRole === 'vendor'
            ? 'text-[#0F172A]'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Store className={`w-5 h-5 ${currentRole === 'vendor' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className={`text-[10px] tracking-tight mt-0.5 ${currentRole === 'vendor' ? 'font-bold text-[#0F172A]' : 'font-medium'}`}>
          Vendor
        </span>
        {currentRole === 'vendor' && (
          <span className="w-1 h-1 rounded-full bg-[#0F172A] mt-0.5" />
        )}
      </button>

      {/* 5. Admin Security Matrix */}
      <button
        onClick={() => {
          onSelectRole('admin');
          onScrollToTop();
        }}
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] rounded-xl transition-all cursor-pointer ${
          currentRole === 'admin'
            ? 'text-rose-600'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <ShieldAlert className={`w-5 h-5 ${currentRole === 'admin' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className={`text-[10px] tracking-tight mt-0.5 ${currentRole === 'admin' ? 'font-bold text-rose-600' : 'font-medium'}`}>
          Risk
        </span>
        {currentRole === 'admin' && (
          <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />
        )}
      </button>

    </nav>
  );
};
