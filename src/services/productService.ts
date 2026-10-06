/**
 * NEXORA / MARKETHUB — Product Catalog Service
 * Implements Section 11, 12, and Phase 2 Service Layer
 */
import { Product, CategoryChapter } from '../types';
import { CATEGORIES } from '../data/products';
import { apiClient, API_CONFIG, ApiResponse } from './apiClient';

export interface ProductFilterParams {
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  verifiedOnly?: boolean;
}

export const productService = {
  async getCategories(): Promise<ApiResponse<readonly CategoryChapter[]>> {
    if (API_CONFIG.DATA_SOURCE === 'mock') {
      return { success: true, data: CATEGORIES };
    }
    return apiClient.get<readonly CategoryChapter[]>('/categories');
  },

  async getAllProducts(): Promise<ApiResponse<readonly Product[]>> {
    if (API_CONFIG.DATA_SOURCE === 'mock') {
      const all = CATEGORIES.flatMap(c => c.products);
      return { success: true, data: all, meta: { total: all.length } };
    }
    return apiClient.get<readonly Product[]>('/products');
  },

  async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    if (API_CONFIG.DATA_SOURCE === 'mock') {
      const all = CATEGORIES.flatMap(c => c.products);
      const prod = all.find(p => p.id === id) || null;
      return { success: !!prod, data: prod };
    }
    return apiClient.get<Product>(`/products/${id}`);
  },

  async searchProducts(params: ProductFilterParams): Promise<ApiResponse<readonly Product[]>> {
    if (API_CONFIG.DATA_SOURCE === 'mock') {
      let results: readonly Product[] = CATEGORIES.flatMap(c => c.products);
      if (params.category) {
        results = results.filter(p => p.category === params.category);
      }
      if (params.query) {
        const q = params.query.toLowerCase();
        results = results.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q)
        );
      }
      return { success: true, data: results, meta: { total: results.length } };
    }
    return apiClient.post<readonly Product[]>('/products/search', params);
  }
};
