import { apiClient } from './apiClient';
import type { VendorMetrics, VendorProduct, OrderRecord } from '../types';

export const mockVendorMetrics: VendorMetrics = {
  grossRevenue: '₹4,82,900.00',
  activeListings: 18,
  escrowLocked: '₹64,200.00',
  disputeRate: '0.04%',
  sellerScore: '99.8 / 100',
  kybStatus: 'VERIFIED'
};

export const mockVendorInventory: VendorProduct[] = [
  {
    id: 'prod-run-01',
    title: 'Nike Air VaporMax Flyknit',
    category: 'shoes',
    price: 18495,
    stock: 24,
    status: 'ACTIVE',
    merchantId: 'VEND-001',
    lastAuditTimestamp: '2026-10-05 21:00 UTC'
  },
  {
    id: 'prod-cam-02',
    title: 'Sony Alpha a7 IV 33MP Mirrorless',
    category: 'cameras',
    price: 249990,
    stock: 3,
    status: 'LOW_STOCK',
    merchantId: 'VEND-001',
    lastAuditTimestamp: '2026-10-05 22:15 UTC'
  },
  {
    id: 'prod-aud-03',
    title: 'Sony WH-1000XM5 Studio Edition',
    category: 'headphones',
    price: 34990,
    stock: 16,
    status: 'ACTIVE',
    merchantId: 'VEND-001',
    lastAuditTimestamp: '2026-10-05 18:30 UTC'
  },
  {
    id: 'prod-lux-04',
    title: 'Rolex Submariner Date Oystersteel',
    category: 'watches',
    price: 849000,
    stock: 1,
    status: 'SECURITY_HELD',
    merchantId: 'VEND-001',
    lastAuditTimestamp: '2026-10-05 23:10 UTC'
  }
];

export const mockVendorOrders: OrderRecord[] = [
  {
    id: 'ORD-9921',
    customerName: 'Marcus Vance',
    date: 'Today, 22:40',
    total: '₹42,000',
    status: 'Escrow Confirmed',
    signatureHash: '0x9fa...4b12',
    itemsCount: 2
  },
  {
    id: 'ORD-9884',
    customerName: 'Elena Rostova',
    date: 'Yesterday, 14:15',
    total: '₹2,49,990',
    status: 'In Transit',
    signatureHash: '0x3cc...117a',
    itemsCount: 1
  },
  {
    id: 'ORD-9740',
    customerName: 'Siddharth Patel',
    date: '04 Oct, 09:30',
    total: '₹79,800',
    status: 'Delivered',
    signatureHash: '0x88e...b501',
    itemsCount: 2
  }
];

export const vendorService = {
  async getMetrics(): Promise<VendorMetrics> {
    const res = await apiClient.get<VendorMetrics>('/vendor/metrics');
    return res.data || mockVendorMetrics;
  },

  async getInventory(): Promise<VendorProduct[]> {
    const res = await apiClient.get<VendorProduct[]>('/vendor/inventory');
    return res.data || mockVendorInventory;
  },

  async getOrders(): Promise<OrderRecord[]> {
    const res = await apiClient.get<OrderRecord[]>('/vendor/orders');
    return res.data || mockVendorOrders;
  },

  async updateStock(productId: string, newStock: number): Promise<boolean> {
    const res = await apiClient.post<{ success: boolean }>(`/vendor/inventory/${productId}/stock`, { stock: newStock });
    return res.success;
  }
};
