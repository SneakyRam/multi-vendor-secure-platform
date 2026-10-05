# Project Approach & Architecture — Build Secure 24

**Team ID:** 18
**Project Name:** MarketHub
**Team Size:** 4 Members
**Primary Track / Domain:** Cybersecurity + E-Commerce + AI

---

## 1. Problem Understanding, Scope & Threat Model

### 1.1 Problem Statement & Real-World Motivation
MarketHub addresses the inherent trust deficit in multi-vendor e-commerce platforms. We are solving the challenge of ensuring secure transactions, data isolation, and robust authorization across disparate vendors, customers, and administrators within a unified ecosystem, augmented by an AI risk-engine gateway.

### 1.2 Target Users & Personas
- **Customers**: Browse products, manage carts, and place orders securely.
- **Vendors**: Manage their specific inventory, process their allocated orders, isolated strictly from other vendors' data.
- **Admins**: Oversee platform health, perform security investigations, manage risk, and approve vendors.
- **AI Gateway**: An autonomous agent that can invoke platform tools on behalf of users, constrained by strict RBAC policies.

### 1.3 Threat Model & Attack Surface
- **Critical Assets:** User PII, session tokens, financial transaction data, product pricing integrity.
- **Potential Attack Vectors:** 
  - Cross-vendor data leakage (BOLA/IDOR).
  - Price tampering during multi-vendor checkout.
  - CSRF during state-changing operations.
  - AI Prompt Injection leading to unauthorized tool invocation.
- **OWASP Top 10 Considerations:** Broken Access Control, Cryptographic Failures, CSRF.

---

## 2. Technical Architecture & Secure System Design

### 2.1 High-Level Architecture Overview
MarketHub operates as a Modular Monolith. The system is divided into strict domain modules (Auth, Users, Vendors, Products, Cart, Orders, Admin, Security, Risk, AI). The core is protected by a centralized Attribute-Based Access Control (ABAC) Policy Engine.

### 2.2 Data Flow & Component Interaction
Ingress -> Helmet/CORS -> Rate Limiter -> Request ID -> Auth Middleware (Session/CSRF) -> Zod Validation -> Route Controller -> Policy Engine Authorization -> Domain Service -> Prisma DB.

### 2.3 Technology Stack Rationale
- **Backend / API Framework:** Express.js + TypeScript — *Why chosen:* Rapid prototyping, strong typing, massive ecosystem for middleware.
- **Frontend / Client:** React (Handled separately)
- **Database & Persistence:** 
  - PostgreSQL (via Prisma) for relational consistency and transactional checkout.
  - Redis for fast, ephemeral session caching and rate limiting.
  - Neo4j for graphical threat intelligence and security event clustering.
- **Authentication & Cryptography:** Argon2 for robust password hashing, HMAC for CSRF, secure HTTP-only cookies for sessions.

### 2.4 Defense-in-Depth Security Controls
1. **Authentication & Session Security:** Argon2 password hashing. Secure, HttpOnly, SameSite=Lax cookies with short-lived session tokens stored in Redis and persisted in DB.
2. **Authorization & Access Control:** Centralized Policy Engine (`policy-engine.ts`) with strict resource-level isolation (e.g., vendors can only update their own products).
3. **Input Validation & Sanitization:** Strict Zod schemas for all inbound traffic. Recursive object sanitization for XSS and NoSQL injection prevention.
4. **Rate Limiting & Abuse Prevention:** Redis-backed rate limiting per IP address.
5. **Transactional Consistency:** Multi-vendor checkout uses Prisma Interactive Transactions to prevent race conditions and price tampering.

---

## 3. Implementation Milestones & 24-Hour Timeline

| Milestone / Phase | Time Window | Key Objectives & Deliverables | Security Verification | Status |
|---|---|---|---|---|
| **Phase 1: Foundation & Setup** | 0h – 2h | Contract onboarding, repo setup, baseline data schemas | Secret scan & baseline check | `Complete` |
| **Phase 2: Core Domain & Auth** | 2h – 6h | Core business logic, secure authentication & ABAC authorization | Auth test suite & crypto validation | `Complete` |
| **Phase 3: Security & Hardening**| 6h – 10h | Input validation, rate limiting, error handling, security middleware | SAST scanning & edge case tests | `Complete` |
| **Phase 4: Polish & Deployment**| 10h – 24h | UI polish, live cloud deployment, final docs & commit freeze | Live deployment URL check | `Planned` |

---

## 4. Architecture Decision Records (ADRs)

### ADR-001: Centralized Policy-Based Authorization (ABAC)
- **Status:** Accepted
- **Context:** Hardcoding `if (user.id !== product.vendorId)` across dozens of controllers leads to inconsistent enforcement and IDOR vulnerabilities.
- **Decision & Rationale:** Implement a centralized `policy-engine.ts` that takes an Actor, Action, and Resource, delegating to domain-specific policies.
- **Security & Performance Trade-offs:** Slight overhead in policy resolution, but completely eliminates scattered authorization bugs.

### ADR-002: Multi-Vendor Checkout Consistency
- **Status:** Accepted
- **Context:** A single cart can contain products from multiple vendors, requiring complex split-routing and financial consistency.
- **Decision & Rationale:** Use Prisma Interactive Transactions to group the operation. The cart is split into a central `OrderGroup` and vendor-specific `Order` records. Product prices are snapshotted at checkout time to prevent mid-transaction price manipulation.
- **Security & Performance Trade-offs:** Locks rows during transaction, slightly reducing write concurrency but guaranteeing 100% financial consistency.

---

## 5. Engineering Journal & Real-Time Decision Log

### [2026-10-05 16:15 IST] Entry 1: Project Initialization & Scope Lock
- **Focus:** Initial repository setup, team alignment, and schema architecture.
- **Resolution:** Successfully ran the onboarding contract and recorded team details.

### [2026-10-05 16:30 IST] Entry 2: Foundation & Database Layer
- **Focus:** Initializing Express server, Zod env validation, and Prisma schemas.
- **Resolution:** Established robust error handling and connectivity to PostgreSQL, Redis, and Neo4j.

### [2026-10-05 16:35 IST] Entry 3: Auth & Authorization ABAC Engine
- **Focus:** Implementing sessions, CSRF, and strict object-level access control.
- **Resolution:** Built the Auth service with Argon2, and the Policy Engine with 9 domain-specific policies enforcing isolation.

### [2026-10-05 16:40 IST] Entry 4: Commerce Modules & Security Core
- **Focus:** Building the core commerce loop and the Security core (Audit, Risk, Sanitization).
- **Resolution:** Built transactional checkout, AI Gateway, Risk Engine, and seeded the database.

---

## 6. Testing, Security Verification & Deployment Record

### 6.1 Testing & Security Verification Strategy
- **Unit & Integration Tests:** Vitest configured for security matrix testing (Auth bypass attempts, IDOR checks, SQLi probing).
- **Static Analysis & Linting:** TypeScript strict mode, Zod compilation.

### 6.2 Deployment Verification
- **Live Deployment Platform:** (Pending)
- **Deployment URL:** (Pending)
- **Health Check Endpoint:** `/api/health`
