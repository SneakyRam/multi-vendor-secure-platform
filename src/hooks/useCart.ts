import { useState, useCallback } from 'react';
import type { Product, CartItem } from '../types';

export function useCart() {
  const [items, setItems] = useState<readonly CartItem[]>([]);
  const [isTamperDetected, setIsTamperDetected] = useState(false);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const numeric = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + numeric * item.quantity;
  }, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
    isTamperDetected,
    setIsTamperDetected
  };
}
