# MarketHub (NEXORA) Data Models Specification

This document details the data persistence models across **PostgreSQL** (relational source of truth), **Redis** (session & rate-limiting cache), and **Neo4j** (identity & fraud relationship graph).

---

## 1. PostgreSQL Relational Schemas (Source of Truth)

### Table: `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Unique user identifier |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Verified user email |
| `password_hash` | `TEXT` | `NOT NULL` | Argon2id cryptographic hash |
| `role` | `VARCHAR(32)` | `NOT NULL, CHECK (role IN ('CUSTOMER', 'VENDOR', 'ADMIN'))` | System access role |
| `mfa_enabled` | `BOOLEAN` | `DEFAULT FALSE` | Step-up TOTP flag |
| `mfa_secret` | `TEXT` | `NULLABLE` | Encrypted TOTP seed |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Registration timestamp |

### Table: `vendors`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | e.g. `VEND-001` |
| `user_id` | `UUID` | `REFERENCES users(id) ON DELETE CASCADE` | Associated account |
| `business_name` | `VARCHAR(255)` | `NOT NULL` | Registered trading name |
| `kyb_status` | `VARCHAR(32)` | `CHECK (kyb_status IN ('PENDING', 'VERIFIED', 'SUSPENDED'))` | Verification tier |
| `escrow_balance` | `DECIMAL(12,2)` | `DEFAULT 0.00` | Locked funds awaiting fulfillment |
| `seller_score` | `DECIMAL(4,1)` | `DEFAULT 100.0` | Reputation score (0-100) |

### Table: `products`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Product slug / unique ID |
| `vendor_id` | `VARCHAR(64)` | `REFERENCES vendors(id) ON DELETE RESTRICT` | Merchant owner |
| `category` | `VARCHAR(32)` | `NOT NULL` | shoes, headphones, watches, etc. |
| `name` | `VARCHAR(255)` | `NOT NULL` | Product title |
| `description` | `TEXT` | `NOT NULL` | Full markdown description |
| `price_cents` | `INTEGER` | `NOT NULL, CHECK (price_cents > 0)` | Stored as integer cents |
| `stock` | `INTEGER` | `NOT NULL, DEFAULT 0, CHECK (stock >= 0)` | Available physical inventory |
| `status` | `VARCHAR(32)` | `DEFAULT 'ACTIVE'` | ACTIVE, LOW_STOCK, QUARANTINED |

### Table: `orders`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | e.g. `ORD-9921` |
| `customer_id` | `UUID` | `REFERENCES users(id)` | Ordering customer |
| `total_cents` | `INTEGER` | `NOT NULL` | Total order price in cents |
| `escrow_status` | `VARCHAR(32)` | `NOT NULL` | ESCROW_LOCKED, RELEASED, REFUNDED |
| `signature_hash`| `TEXT` | `NOT NULL` | SHA-256 HMAC of items + total |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Order placement time |

---

## 2. Redis Caching & Transient State Keys

| Key Pattern | Data Structure | TTL | Purpose |
|---|---|---|---|
| `session:{session_token}` | Hash | 86,400s (24h) | User ID, role, tenant ID, device fingerprint |
| `rate_limit:ip:{client_ip}` | String / Counter | 60s | Sliding window rate limit (max 120 req/min) |
| `escrow:lock:{order_id}` | Hash | 604,800s (7d) | Escrow state, release triggers, cryptographic challenge |
| `cart:{user_id}` | Hash | 2,592,000s (30d) | Persisted shopping cart items |

---

## 3. Neo4j Graph Model (Identity & Threat Intelligence)

### Node Labels
- `:User { id, email, riskScore }`
- `:Vendor { id, businessName, kybTier }`
- `:Device { fingerprint, userAgent, canvasHash }`
- `:IP { address, asn, isTor, isVpn, threatScore }`
- `:Order { id, total, status, escrowHash }`
- `:SecurityIncident { id, vector, timestamp, blocked }`

### Relationships
- `(:User)-[:LOGGED_IN_FROM]->(:Device)`
- `(:Device)-[:CONNECTS_VIA]->(:IP)`
- `(:User)-[:PLACED_ORDER]->(:Order)`
- `(:Order)-[:FULFILLED_BY]->(:Vendor)`
- `(:IP)-[:DISPATCHED_THREAT]->(:SecurityIncident)`
- `(:SecurityIncident)-[:TARGETED]->(:Vendor | :Order | :User)`
