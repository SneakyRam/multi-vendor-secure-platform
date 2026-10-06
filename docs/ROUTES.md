# MarketHub (NEXORA) Route Architecture

This document catalogs all platform routes across the three user experiences (Customer, Vendor, Admin) and system infrastructure.

---

## 1. Customer Storefront Routes

| Route | View Component | Role Required | Purpose |
|---|---|---|---|
| `/` | `ProductStage.tsx`, `LookbookGrid.tsx` | Public | Hero stage, category exploration, trust indicators, featured products |
| `/shop` | `CatalogDrawer.tsx` | Public | Full multi-category product catalog with price & category filters |
| `/product/:id` | `ProductModal.tsx` | Public | High-resolution multi-angle asset inspection, seller credentials, escrow terms |
| `/cart` | `CartModal.tsx` | Public / Customer | Escrow cart summary, tamper verification, checkout initiation |
| `/checkout` | `CheckoutView.tsx` | Customer | Cryptographic order signing, address validation, zero-trust escrow lock |
| `/orders` | `CustomerOrders.tsx` | Customer | Buyer order history, tracking numbers, hash-verified receipts |
| `/order/:id` | `OrderTracking.tsx` | Customer | Real-time transit milestone status, escrow release confirmation |
| `/vendor/:id` | `VendorProfile.tsx` | Public | Public storefront for a specific merchant, trust badge, verified ratings |
| `/ai` | `AIAssistantModal.tsx` | Public / Customer | AI shopping concierge (scoped to catalog & escrow guidance) |

---

## 2. Vendor Workspace Routes

| Route | View Component | Role Required | Purpose |
|---|---|---|---|
| `/vendor` | `VendorPortal.tsx` (Overview) | Vendor (`ROLE_VENDOR`) | Revenue KPI cards, escrow balance, recent orders, seller score |
| `/vendor/inventory` | `VendorPortal.tsx` (Inventory) | Vendor (`ROLE_VENDOR`) | Listing catalog, stock levels, reserve alarms, price updates |
| `/vendor/orders` | `VendorPortal.tsx` (Orders) | Vendor (`ROLE_VENDOR`) | Fulfillment dispatch, tracking number entry, escrow release |
| `/vendor/audit` | `VendorPortal.tsx` (Compliance) | Vendor (`ROLE_VENDOR`) | KYB verification tier, dispute audit log, security checkups |
| `/vendor/copilot` | `AIAssistantModal.tsx` | Vendor (`ROLE_VENDOR`) | Store assistant (ABAC restricted: **refuses cross-tenant queries**) |

---

## 3. Admin Security Sentinel Routes

| Route | View Component | Role Required | Purpose |
|---|---|---|---|
| `/admin` | `AdminSecurityPortal.tsx` (Overview) | Admin (`ROLE_ADMIN`) | Platform health, blocked probes counter, live attack surface count |
| `/admin/threats` | `AdminSecurityPortal.tsx` (Events) | Admin (`ROLE_ADMIN`) | Real-time threat feed (BOLA, CSRF, Price Tamper, SQLi, Auth Anomaly) |
| `/admin/graph` | `AdminSecurityPortal.tsx` (Neo4j Graph)| Admin (`ROLE_ADMIN`) | Interactive identity-IP-device-order relationship graph |
| `/admin/vendors` | `AdminVendorManagement.tsx` | Admin (`ROLE_ADMIN`) | Vendor compliance status, freeze merchant, audit payout escrow |
| `/admin/copilot` | `AIAssistantModal.tsx` | Admin (`ROLE_ADMIN`) | Threat analysis copilot (scoped to system logs & attack vectors) |

---

## 4. Authentication & System Routes

| Route | Method / View | Protection | Purpose |
|---|---|---|---|
| `/auth/login` | `AuthModal.tsx` | Rate-limited | WebAuthn / Passkey / Email + Password login |
| `/auth/register` | `AuthModal.tsx` | Rate-limited | Customer or Vendor onboarding with email verification |
| `/auth/verify-mfa` | `MFAModal.tsx` | Step-up Auth | Time-based One-Time Password (TOTP) step-up for sensitive actions |
| `/healthz` | Backend JSON | Public | Service health & database connectivity check |
| `/metrics` | Prometheus | Admin/Internal | Latency, request rate, and security blocking telemetry |
