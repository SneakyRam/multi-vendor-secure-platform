# MarketHub (NEXORA) Security UI State Specification

This document defines how client-side and server-side security events, access control denials (403), tamper attempts, and CSP violations are surfaced to users across the three product experiences.

---

## 1. Golden Rule of Security Feedback
**Never mock or invent fake security claims in the UI.**  
Phrases like "100% Secure" or "Unhackable AI Shield" are strictly banned. All security feedback must use audit-grade, verifiable status states:
- `Request Blocked by Security Policy`
- `Cross-Tenant Access Prohibited (ABAC 403)`
- `Price Integrity Mismatch Detected`
- `CSP Violation Reported`
- `Rate Limit Exceeded (429 Too Many Requests)`

---

## 2. Denial & Violation UX Patterns

### 1. Cross-Tenant IDOR / BOLA Denial (Vendor Workspace)
- **Trigger**: A vendor attempts to read or mutate another vendor's inventory, payouts, or analytics.
- **UI Presentation**:
  - Modal / Banner: High-contrast amber/red badge `ABAC_AUTHORIZATION_FAILED`.
  - Explanatory Text: *"Access Denied: The requested resource belongs to merchant domain VEND-009. Current tenant session is VEND-001. Event logged to platform audit trail."*
  - Action Button: *"Return to My Workspace"* (Secondary style, no retry).

### 2. Client-Side Price Tampering (Checkout Experience)
- **Trigger**: Client modifies cart DOM or dispatches modified item price payload.
- **UI Presentation**:
  - Full-screen or modal alert: Rose/Red badge `TAMPER_VERIFICATION_FAILURE`.
  - Message: *"Checkout aborted: The server detected an integrity checksum discrepancy between client cart items and the authenticated price ledger. Your cart has been safely resynchronized with current catalog pricing."*
  - SIEM Action: Dispatches security event to `/admin/security/events` with origin IP and client fingerprint.

### 3. Content Security Policy (CSP) & XSS Defenses
- **Trigger**: Malicious input payload containing `<script>` or unapproved origin resources in reviews or product descriptions.
- **UI Presentation**:
  - Input field highlights in red with badge `DISALLOWED_MARKUP_DETECTED`.
  - Inline error: *"Strict nonce-based Content Security Policy prohibited execution of unsanitized HTML."*

### 4. Rate Limiting Feedback (HTTP 429)
- **Trigger**: Automated probe exceeding 120 requests/minute.
- **UI Presentation**:
  - Toast banner: `RATE_LIMIT_ACTIVE`.
  - Message: *"Too many requests dispatched. Cooldown period active for 45 seconds to protect platform integrity."*
  - Visual countdown timer until unblock.

---

## 3. Trust UI Indicators (Customer Storefront)
- **Vendor Verified Badge**: Displays `KYB Tier 3: Identity & Bond Confirmed` with tooltip explaining escrow protection.
- **Escrow Lock Indicator**: On checkout, displays `Cryptographic Escrow: Funds remain held until tracking milestone confirms physical delivery`.
- **Order Hash Receipt**: Each order confirmation generates a SHA-256 integrity receipt hash viewable by the buyer.
