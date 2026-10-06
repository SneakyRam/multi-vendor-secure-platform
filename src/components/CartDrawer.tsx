import React from 'react';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (!isOpen) return null;

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const totalPriceNum = items.reduce((acc, item) => {
    const numericStr = item.product.price.replace(/[^0-9]/g, '');
    const price = parseInt(numericStr, 10) || 0;
    return acc + price * item.quantity;
  }, 0);

  const formattedTotal = `₹${totalPriceNum.toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer"
        title="Click to close"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-black/10 shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-[#0F172A]">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-black/10">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#0F172A]" />
              <h3 className="font-brand font-black text-xl uppercase tracking-wider text-[#0F172A]">
                Shopping Bag
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                {totalCount}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-black/10 flex items-center justify-center text-[#0F172A] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
                <p className="text-sm font-mono text-neutral-500">Your bag is currently empty.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-[#0F172A] text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl bg-neutral-50 border border-black/5 flex items-center justify-between space-x-4"
                >
                  <div className="w-16 h-16 rounded-xl bg-white p-1 border border-black/5 flex items-center justify-center shrink-0">
                    <img
                      src={item.product.hero}
                      alt={item.product.name}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-brand font-bold text-sm text-[#0F172A] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs font-mono font-extrabold text-[#0F172A] mt-0.5">
                      {item.product.price}
                    </p>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {item.product.seller}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2 bg-white border border-black/10 rounded-lg px-2 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="text-neutral-500 hover:text-black font-mono px-1 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="text-neutral-500 hover:text-black font-mono px-1 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          <div className="pt-6 border-t border-black/10 space-y-4">
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="text-[#0F172A] font-bold">{formattedTotal}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Cryptographic Protocol Fee</span>
                <span className="text-emerald-600 font-bold">Waived (0.00%)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#0F172A] pt-2 border-t border-black/5">
                <span>Total Amount</span>
                <span>{formattedTotal}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Multi-Sig Smart Escrow locks payment until delivery receipt.</span>
            </div>

            <button
              disabled={items.length === 0}
              className="w-full py-3.5 rounded-full bg-[#0F172A] hover:bg-black disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-brand font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <span>Proceed to Escrow Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
