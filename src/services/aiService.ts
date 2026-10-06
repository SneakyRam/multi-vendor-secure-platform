import type { AIRoleContext, AIMessage } from '../types';

export const aiService = {
  async sendMessage(prompt: string, role: AIRoleContext): Promise<AIMessage> {
    const trimmed = prompt.trim().toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // ABAC Cross-tenant restriction check (Section 7 rule)
    if (role === 'VENDOR') {
      const crossTenantTerms = ['other vendor', 'competitor', 'vend-002', 'another store', 'rival sales', 'vend-009'];
      const isCrossTenant = crossTenantTerms.some(term => trimmed.includes(term));

      if (isCrossTenant) {
        return {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: 'Access Denied: The requested resource belongs to another merchant domain. NEXORA strict Attribute-Based Access Control (ABAC) prevents cross-tenant data leakage or competitor metric disclosure.',
          timestamp,
          verifiedABACPolicy: 'DENY_CROSS_TENANT_LEASE',
          refusedUnauthorized: true
        };
      }

      if (trimmed.includes('inventory') || trimmed.includes('stock')) {
        return {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: 'Store Audit: Sony Alpha a7 IV is currently at 3 units (below the 5-unit safety reserve). Recommend replenishing stock before high-traffic evening hours.',
          timestamp,
          verifiedABACPolicy: 'ALLOW_MERCHANT_SELF_INVENTORY'
        };
      }

      return {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `Store Copilot: Analyzing your storefront VEND-001. All listings comply with marketplace KYB tier 3 requirements. 2 orders are pending fulfillment verification.`,
        timestamp,
        verifiedABACPolicy: 'ALLOW_MERCHANT_SELF_CONTEXT'
      };
    }

    if (role === 'ADMIN') {
      if (trimmed.includes('attack') || trimmed.includes('threat') || trimmed.includes('security')) {
        return {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: 'Sentinel Analysis: 1,429 automated probes intercepted in the last 24h. 1 high-severity coupon tamper attempt was quarantined at 23:44 UTC. Cryptographic escrow ledger hash chain remains untampered.',
          timestamp,
          verifiedABACPolicy: 'ALLOW_ADMIN_SECURITY_AUDIT'
        };
      }

      return {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: 'Sentinel AI ready. Monitoring marketplace Neo4j graph nodes for sybil identities, BOLA traversal anomalies, and suspicious checkout velocity.',
        timestamp,
        verifiedABACPolicy: 'ALLOW_ADMIN_PLATFORM_READ'
      };
    }

    // CUSTOMER role
    if (trimmed.includes('shoe') || trimmed.includes('run') || trimmed.includes('sneaker')) {
      return {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: 'I recommend the Nike Air VaporMax Flyknit from verified merchant Apex Gear Labs (₹18,495). It features escrow-backed fulfillment and cryptographic authenticity certification.',
        timestamp,
        verifiedABACPolicy: 'ALLOW_PUBLIC_CATALOG_SEARCH'
      };
    }

    return {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: `I am your NEXORA Personal Shopping Guide. Every product in our catalog is backed by verified merchant escrow and buyer protection. How can I help you find your next piece?`,
      timestamp,
      verifiedABACPolicy: 'ALLOW_PUBLIC_CATALOG_SEARCH'
    };
  }
};
