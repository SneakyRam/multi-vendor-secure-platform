import { apiClient } from './apiClient';
import type { ThreatEvent, GraphNode, GraphEdge, SecuritySentinelStats } from '../types';

export const mockSentinelStats: SecuritySentinelStats = {
  activeAnomalies: 3,
  blockedProbes24h: 1429,
  activeAttackSurfaceNodes: 28,
  zeroTrustEnforcementRatio: '100%',
  sentinelStatus: 'ARMED_HEALTHY'
};

export const mockSecurityEvents: ThreatEvent[] = [
  {
    id: 'SEC-9081',
    timestamp: '23:44:12 UTC',
    ip: '198.51.100.44',
    action: 'POST /api/v1/checkout/apply-discount',
    status: 'BLOCKED',
    severity: 'HIGH',
    actor: 'Anonymous Proxy (Tor Exit #412)',
    targetResource: 'Cart Escrow Calculator',
    mitigationReason: 'Client-side payload attempted price tampering (-₹2,000 coupon forgery).'
  },
  {
    id: 'SEC-9080',
    timestamp: '23:41:05 UTC',
    ip: '203.0.113.19',
    action: 'GET /api/v1/vendor/payouts/VEND-009',
    status: 'BLOCKED',
    severity: 'CRITICAL',
    actor: 'Session SID-8812 (Vendor VEND-001)',
    targetResource: 'VEND-009 Financial Ledger',
    mitigationReason: 'BOLA/IDOR violation. Cross-tenant access strictly denied by ABAC.'
  },
  {
    id: 'SEC-9079',
    timestamp: '23:38:50 UTC',
    ip: '192.0.2.77',
    action: 'POST /api/v1/auth/mfa/challenge',
    status: 'FLAGGED',
    severity: 'MEDIUM',
    actor: 'User usr_9941a',
    targetResource: 'Admin Session Guard',
    mitigationReason: 'Impossible travel anomaly detected (NYC -> Singapore in 18 minutes).'
  }
];

export const mockGraphNodes: GraphNode[] = [
  { id: 'usr-1', label: 'User: dev_guest', type: 'User', riskScore: 12, details: 'Authenticated shopper session' },
  { id: 'ip-1', label: '198.51.100.44', type: 'IP', riskScore: 88, details: 'Known bulletproof hosting ASN' },
  { id: 'dev-1', label: 'Device: Fingerprint #981', type: 'Device', riskScore: 65, details: 'Canvas spoofing detected' },
  { id: 'vend-1', label: 'Vendor: Apex Gear Labs', type: 'Vendor', riskScore: 4, details: 'Bonded merchant tier 3' },
  { id: 'ord-1', label: 'Order #ORD-9921', type: 'Order', riskScore: 18, details: 'Escrow lock active (₹42,000)' },
  { id: 'threat-1', label: 'Exploit: BOLA Probe', type: 'Threat', riskScore: 95, details: 'Resource enumeration blocked' }
];

export const mockGraphEdges: GraphEdge[] = [
  { from: 'usr-1', to: 'dev-1', relation: 'LOGGED_IN_FROM' },
  { from: 'dev-1', to: 'ip-1', relation: 'CONNECTS_VIA', flag: 'SUSPICIOUS' },
  { from: 'ip-1', to: 'threat-1', relation: 'DISPATCHED', flag: 'BLOCKED' },
  { from: 'usr-1', to: 'ord-1', relation: 'PLACED_ORDER', flag: 'VERIFIED' },
  { from: 'ord-1', to: 'vend-1', relation: 'FULFILLED_BY', flag: 'VERIFIED' }
];

export const adminService = {
  async getSentinelStats(): Promise<SecuritySentinelStats> {
    const res = await apiClient.get<SecuritySentinelStats>('/admin/sentinel/stats');
    return res.data || mockSentinelStats;
  },

  async getSecurityEvents(): Promise<ThreatEvent[]> {
    const res = await apiClient.get<ThreatEvent[]>('/admin/security/events');
    return res.data || mockSecurityEvents;
  },

  async getGraphData(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const res = await apiClient.get<{ nodes: GraphNode[]; edges: GraphEdge[] }>('/admin/security/graph');
    return res.data || { nodes: mockGraphNodes, edges: mockGraphEdges };
  },

  async isolateNode(nodeId: string): Promise<boolean> {
    const res = await apiClient.post<{ success: boolean }>(`/admin/security/nodes/${nodeId}/isolate`, {});
    return res.success;
  }
};
