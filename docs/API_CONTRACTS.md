# MarketHub (NEXORA) API Contracts Specification

This document defines the standardized RESTful API contracts, request payloads, response envelopes, and error codes for backend integration.

---

## 1. Standard Response Envelope

All API endpoints MUST respond with the following JSON envelope format:

```typescript
export interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: {
    timestamp: string;      // ISO-8601 UTC
    requestId: string;      // e.g. "req_01HPX88"
    traceId?: string;       // Distributed tracing span
    auditLogged?: boolean;  // True if recorded in security SIEM
  };
}
```

---

## 2. Catalog & Commerce Endpoints

### `GET /api/v1/products`
Returns active product catalog with optional category and search filters.
- **Query Parameters**:
  - `category` (optional): `'shoes' | 'headphones' | 'watches' | 'cameras' | 'backpacks'`
  - `q` (optional): search keyword
  - `limit` (default: 20)
  - `offset` (default: 0)

### `GET /api/v1/products/:id`
Returns complete product data, multi-angle asset paths, and seller verification grade.

### `POST /api/v1/checkout/create-intent`
Initiates a cryptographic escrow order intent.
- **Headers**: `Authorization: Bearer <token>`, `X-Client-Timestamp: <iso>`
- **Request Body**:
```json
{
  "items": [
    { "productId": "prod-run-01", "quantity": 1, "claimedPrice": 210.00 }
  ],
  "shippingAddress": {
    "recipient": "Marcus Vance",
    "street": "742 Evergreen Terrace",
    "city": "Springfield",
    "postalCode": "97477",
    "country": "US"
  }
}
```
- **Validation**:
  - Backend MUST recalculate price on server from PostgreSQL product table.
  - If `claimedPrice` differs from `product.price`, return HTTP 422 `ERR_PRICE_HASH_MISMATCH` and log security incident.

---

## 3. Vendor Workspace Endpoints

### `GET /api/v1/vendor/metrics`
- **Headers**: `Authorization: Bearer <vendor_token>`
- **Response Data**:
```json
{
  "grossRevenue": "₹4,82,900.00",
  "activeListings": 18,
  "escrowLocked": "₹64,200.00",
  "disputeRate": "0.04%",
  "sellerScore": "99.8 / 100",
  "kybStatus": "VERIFIED"
}
```

### `GET /api/v1/vendor/inventory`
- **Protection**: ABAC rule `actor.tenantId == resource.merchantId`.
- **Response**: List of `VendorProduct` records belonging solely to authenticated merchant.

### `POST /api/v1/vendor/inventory/:id/stock`
- **Request Body**: `{ "stock": 15 }`
- **Authorization**: Must verify resource ownership. Cross-tenant modification attempt returns 403 Forbidden.

---

## 4. Admin Threat Sentinel Endpoints

### `GET /api/v1/admin/sentinel/stats`
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response Data**:
```json
{
  "activeAnomalies": 3,
  "blockedProbes24h": 1429,
  "activeAttackSurfaceNodes": 28,
  "zeroTrustEnforcementRatio": "100%",
  "sentinelStatus": "ARMED_HEALTHY"
}
```

### `GET /api/v1/admin/security/events`
Returns live SIEM security logs (recent blocked attempts, BOLA probes, price mutations, CSRF anomalies).

### `GET /api/v1/admin/security/graph`
Returns nodes and edges for the interactive Neo4j fraud and identity relationship graph.

---

## 5. Role-Scoped AI Copilot Endpoint

### `POST /api/v1/ai/query`
- **Request Body**:
```json
{
  "prompt": "Show me sales data for VEND-002",
  "role": "VENDOR",
  "tenantId": "VEND-001"
}
```
- **Response (ABAC Block Enforced)**:
```json
{
  "success": true,
  "data": {
    "role": "assistant",
    "content": "Access Denied: The requested resource belongs to another merchant domain. NEXORA strict Attribute-Based Access Control (ABAC) prevents cross-tenant data leakage.",
    "verifiedABACPolicy": "DENY_CROSS_TENANT_LEASE",
    "refusedUnauthorized": true
  }
}
```
