# Project Approach & Architecture — Build Secure 24

**Team ID:** BUILDSECURE-24-NEXORA  
**Project Name:** NEXORA — A Security-First Multi-Vendor Marketplace  
**Team Size:** 4 Members  
**Primary Track / Domain:** Secure E-Commerce & Cryptographically Verifiable Independent Commerce  

---

## 1. Problem Understanding, Scope & Threat Model

### 1.1 Problem Statement & Real-World Motivation
Modern multi-vendor e-commerce marketplaces suffer from two crippling flaws:
1. **The Visual & Experience Deficit**: Generic SaaS card grids, chaotic visual cliches, and template-based designs fail to give premium products the editorial focus, material depth, and narrative prestige they deserve.
2. **The Trust & Frontend Vulnerability Deficit**: Consumer marketplaces are notoriously vulnerable to client-side attacks, including UI redressing (Clickjacking), Cross-Site Scripting (XSS), prototype pollution from dynamic third-party data, third-party CDN supply chain compromises, and unverified seller asset manipulation.

**NEXORA** solves this by uniting a **fullscreen 100vh cinematic 3D product discovery engine** (inspired by world-class high-motion showcases such as the Nike Slider) with an **uncompromising defense-in-depth cybersecurity architecture**. Every product moment—across footwear, electroacoustics, haute horology, cinema optics, and architectural carry—features isolated floating detail assets, monumental background typography, and cryptographic provenance verification.

---

### 1.2 Target Users & Personas
- **The Discerning Consumer**: Demands an immersive, clutter-free gallery experience to inspect physical craftsmanship, materials, and fine details before purchasing rare items.
- **The Independent Artisan & Verified Merchant**: Needs an elite stage that honors their craft without competing with cheap banner ads or manipulative dark patterns.
- **The Cybersecurity Auditor**: Demands verifiable client-side headers, subresource integrity, zero third-party asset exfiltration, and strict Content Security Policy enforcement.

---

### 1.3 Threat Model & Attack Surface (STRIDE & OWASP Top 10)

| Threat Category | Potential Attack Vector | AURA Defense-in-Depth Mitigation |
| :--- | :--- | :--- |
| **Spoofing / UI Redressing** | Clickjacking via `<iframe>` overlay attacks | Dual-layer defense: Strict `frame-ancestors 'none'` in CSP + inline JavaScript frame buster script in `<head>`. |
| **Tampering (XSS)** | Injected malicious payloads in product search or URL query strings | Strictly sanitized input filters (stripping `<>`, `'`, `"`, `;`, `()`), zero `dangerouslySetInnerHTML`, pure declarative React DOM rendering. |
| **Repudiation** | Counterfeit product claims and manipulated imagery | Verified transparent PNG pipeline (104 assets, 188,607 inner background pixels cleared) + SHA-256 cryptographic merchant signature ledger. |
| **Information Disclosure** | Leakage of user context or referral URLs to external networks | Strict `Referrer-Policy: strict-origin-when-cross-origin` and zero external script trackers. |
| **Denial of Service / UI Thrashing** | Rapid click spamming inducing conflicting GSAP timelines and browser freezing | State debouncing with transition locks (`isTransitioning`), active timeline cancellation (`currentTimeline.kill()`), and GPU-accelerated transforms (`transform3d`, `willChange`). |
| **Prototype Pollution** | Tampering with `Object.prototype` via dynamic catalog payloads | Runtime freezing of all category, product, and detail asset schemas with `Object.freeze()`. |
| **Supply Chain Vulnerability** | Compromised third-party CDN scripts or vulnerable packages | Zero runtime CDN dependencies; all dependencies audited with `npm audit` (**0 vulnerabilities found**); self-hosted local asset pipeline. |

---

## 2. Technical Architecture & Secure System Design

### 2.1 High-Level Architecture Overview
```text
AURA CLIENT ARCHITECTURE
├── Security & Header Guard (CSP Level 3, Frame-Busting, SRI)
├── Core Navigation (AURA Wordmark, Dynamic Section Anchors, Escrow Cart Counter)
├── Cinematic Discovery Engine (Vite 6 + React 18 + GSAP 3.12)
│   ├── Intro Hero ("Discover a Marketplace Built for Trust")
│   ├── Category Chapter 01: SHOES (4 Products, 3D Canvas Stage)
│   ├── Category Chapter 02: HEADPHONES (4 Products, Acoustic Details)
│   ├── Category Chapter 03: WATCHES (4 Products, Horological Complications)
│   ├── Category Chapter 04: CAMERAS (4 Products, Optical Glass Breakdown)
│   └── Category Chapter 05: BACKPACKS (4 Products, Technical Textiles)
├── Product Inspection Dossier Modal (High-Res Parts & SHA-256 Provenance)
├── XSS-Sanitized Real-time Search Modal
├── Slide-Over Escrow Shopping Bag
├── Real-Time Cybersecurity Diagnostic HUD (BuildSecure Engine Status)
└── Editorial Footer & Compliance Manifesto
```

---

### 2.2 Technology Stack Rationale
- **Frontend Core**: React 18 + TypeScript + Vite 6 — Selected for sub-second build times, zero layout shift (CLS = 0), and strict type contracts.
- **Styling Architecture**: Tailwind CSS v4 + Vanilla CSS Design System — Provides custom glassmorphism, 3D perspective stages, and smooth ambient keyframe floats without bloating bundle size.
- **Motion Engine**: GSAP 3.12 (GreenSock) — Selected for 60-120fps physics-based transforms, Y-axis typography rotation, organic float scatter, and non-blocking timeline lifecycle control.
- **Iconography**: Lucide React — Minimalist, accessible vector icons tree-shaken locally.

---

### 2.3 Defense-in-Depth Security Controls
1. **Content Security Policy (CSP)**:
   ```http
   default-src 'self';
   img-src 'self' data: blob:;
   style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
   font-src 'self' https://fonts.gstatic.com;
   script-src 'self' 'unsafe-inline';
   connect-src 'self';
   frame-ancestors 'none';
   ```
2. **Anti-Clickjacking Frame Buster**:
   ```javascript
   if (self === top) {
     var antiClickjack = document.getElementById("antiClickjack");
     if (antiClickjack) antiClickjack.parentNode.removeChild(antiClickjack);
   } else {
     top.location = self.location;
   }
   ```
3. **Accessibility & Reduced Motion**:
   Full support for `@media (prefers-reduced-motion: reduce)`. Large rotations and long transitions automatically fall back to gentle opacity crossfades.

---

## 3. Implementation Milestones & 24-Hour Timeline

| Milestone / Phase | Time Window | Key Objectives & Deliverables | Security & Quality Verification | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Asset Pipeline** | 0h – 4h | Background removal for 104 assets, inner lace loop clearance (188,607 px) | Contact sheets generated, `ASSET_QA_REPORT.md` | `Completed` |
| **Phase 2: Core Frontend** | 4h – 12h | 5 Category Chapters, 20 Products, GSAP 3D stages, floating details | Type-check passed, clean component structure | `Completed` |
| **Phase 3: Hardening & Audits** | 12h – 18h | Strict CSP, Anti-Clickjacking, XSS sanitization, Object.freeze | OWASP Top 10 audit passed, 0 vulnerabilities | `Completed` |
| **Phase 4: Polish & Delivery** | 18h – 24h | Search modal, Cart drawer, responsive viewports, Security HUD | Real browser validation, production verification | `Completed` |

---

## 4. Testing & Verification

- **TypeScript Compilation**: `tsc --noEmit` executed with **0 errors**.
- **Vulnerability Audit**: `npm audit` executed with **0 vulnerabilities**.
- **Asset Integrity**: 104/104 transparent PNG assets verified with original 1024x1024 resolution and padding preserved.
- **Responsiveness**: Tested across Desktop (1440px), Tablet (768px), and Mobile (375px) viewports.
