import { useState, useMemo } from 'react';
import { ALL_PRODUCTS, CATEGORIES } from '../data/products';
import type { CategoryType, Product } from '../types';

export function useProducts() {
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product: Product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return {
    allProducts: ALL_PRODUCTS,
    categories: CATEGORIES,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
}
