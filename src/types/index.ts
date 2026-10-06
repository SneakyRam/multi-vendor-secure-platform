export type CategoryType = 'shoes' | 'headphones' | 'watches' | 'cameras' | 'backpacks';

export interface ProductDetailAsset {
  readonly name: string;
  readonly src: string;
}

export interface Product {
  readonly id: string;
  readonly category: CategoryType;
  readonly name: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly price: string;
  readonly seller: string;
  readonly trustLabel: string;
  readonly background: string;
  readonly accent: string;
  readonly textTheme: 'light' | 'dark';
  readonly hero: string;
  readonly details: readonly ProductDetailAsset[];
  readonly displayWord: string;
  readonly stock?: number;
  readonly rating?: number;
  readonly verificationLevel?: 'L1_BASIC' | 'L2_KYB_VERIFIED' | 'L3_ENTERPRISE_BONDED';
}

export interface CategoryChapter {
  readonly id: CategoryType;
  readonly index: string; // e.g. "01 / 05"
  readonly title: string;
  readonly tagline: string;
  readonly accentColor: string;
  readonly products: readonly Product[];
}

// Cart & Commerce
export interface CartItem {
  readonly product: Product;
  readonly quantity: number;
  readonly addedAt: string;
}

export interface OrderRecord {
  readonly id: string;
  readonly customerName: string;
  readonly date: string;
  readonly total: string;
  readonly status: 'Escrow Confirmed' | 'In Transit' | 'Fulfillment Pending' | 'Delivered' | 'Flagged';
  readonly signatureHash: string;
  readonly itemsCount: number;
}

// Vendor Domain
export interface VendorMetrics {
  readonly grossRevenue: string;
  readonly activeListings: number;
  readonly escrowLocked: string;
  readonly disputeRate: string;
  readonly sellerScore: string;
  readonly kybStatus: 'VERIFIED' | 'PENDING' | 'ACTION_REQUIRED';
}

export interface VendorProduct {
  readonly id: string;
  readonly title: string;
  readonly category: CategoryType;
  readonly price: number;
  readonly stock: number;
  readonly status: 'ACTIVE' | 'LOW_STOCK' | 'SECURITY_HELD';
  readonly merchantId: string;
  readonly lastAuditTimestamp: string;
}

// Admin & Security Domain
export interface ThreatEvent {
  readonly id: string;
  readonly timestamp: string;
  readonly ip: string;
  readonly action: string;
  readonly status: 'BLOCKED' | 'FLAGGED' | 'INVESTIGATING';
  readonly severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  readonly actor: string;
  readonly targetResource: string;
  readonly mitigationReason: string;
}

export interface GraphNode {
  readonly id: string;
  readonly label: string;
  readonly type: 'User' | 'Vendor' | 'Device' | 'IP' | 'Order' | 'Threat';
  readonly riskScore: number;
  readonly details: string;
}

export interface GraphEdge {
  readonly from: string;
  readonly to: string;
  readonly relation: string;
  readonly flag?: 'SUSPICIOUS' | 'VERIFIED' | 'BLOCKED';
}

export interface SecuritySentinelStats {
  readonly activeAnomalies: number;
  readonly blockedProbes24h: number;
  readonly activeAttackSurfaceNodes: number;
  readonly zeroTrustEnforcementRatio: string;
  readonly sentinelStatus: 'ARMED_HEALTHY' | 'ELEVATED_DEFENSE';
}

// AI Message & Context
export type AIRoleContext = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface AIMessage {
  readonly id: string;
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
  readonly timestamp: string;
  readonly verifiedABACPolicy?: string;
  readonly refusedUnauthorized?: boolean;
}
