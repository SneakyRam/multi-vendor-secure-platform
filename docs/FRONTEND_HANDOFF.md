# MarketHub (NEXORA) Frontend Handoff Specification
**Target**: Backend Engineering Team, Security Architects, and Hackathon Judges  
**Domain**: Cybersecurity + Multi-Vendor E-Commerce + Role-Scoped AI  
**Phase**: Phase 2 — API Contract & Architecture Handoff

---

## 1. Executive Summary & Core Paradigm
MarketHub (branded as **NEXORA**) is an AI-enabled multi-vendor marketplace engineered around explicit **Attribute-Based Access Control (ABAC)** and zero-trust trust boundaries.

Unlike standard e-commerce templates that bolt on an "admin panel" or generic chatbot, NEXORA enforces a coherent three-product architecture where:
1. **Customer**: Discover → Evaluate → Buy → Track (with cryptographic escrow guarantees).
2. **Vendor**: Manage → Sell → Fulfill → Analyze (strictly sandboxed to tenant boundaries).
3. **Admin**: Monitor → Govern → Investigate → Protect (real-time threat telemetry and Neo4j relationship intelligence).

---

## 2. Design System & Coherence Principles (Section 6)
All 3 portals share a unified visual language and design token foundation:
- **Typography**: Display: `Outfit`, Body/Interface: `Plus Jakarta Sans`, Telemetry/Code: `JetBrains Mono`.
- **Palette**: Pristine Light Luxe (`#FAFAFA` surfaces, `#0D0E12` high-contrast typography, `#4F46E5` / `#06B6D4` electric accents, subtle security status emerald `#10B981`, warning amber `#F59E0B`, danger rose `#EF4444`).
- **Shared Primitives**: Button hierarchy (Primary, Secondary, Ghost, Destructive), Input text fields, Badges, Toast alerts, Modal dialogs, Command Palette (`Ctrl/Cmd + K`), and Skeleton loaders.
- **Theme Constraint**: Strictly single-theme luxury white aesthetic. Dark mode toggle has been removed to avoid theme fragmentation and maintain immaculate typography contrast.

---

## 3. Directory Layout & Layer Boundaries
```
src/
├── components/          # Shared visual components and role-specific portals
│   ├── Navbar.tsx             # Universal header with role switcher & search
│   ├── ProductStage.tsx       # Cinematic customer stage with 3D product view
│   ├── MobileCategoryFeed.tsx # Touch-optimized mobile category scrub feed
│   ├── VendorPortal.tsx       # Vendor inventory, escrow metrics & order fulfillment
│   ├── AdminSecurityPortal.tsx# Admin command center, live threats & Neo4j graph
│   ├── AIAssistantModal.tsx   # Role-aware ABAC-enforced AI copilot
│   ├── InitialLoader.tsx      # SVG preloader with non-intersecting thunder paths
│   ├── CartModal.tsx          # Escrow-checked shopping cart
│   ├── LookbookGrid.tsx       # Curated editorial product grid
│   └── TrustEngineSection.tsx # Architectural security breakdown
├── services/            # Decoupled backend-ready API abstraction layer
│   ├── apiClient.ts           # Standard fetch envelope, auth headers & error normalization
│   ├── productService.ts      # Catalog, categories, product lookup
│   ├── vendorService.ts       # Merchant metrics, inventory CRUD, order status
│   ├── adminService.ts        # Threat telemetry, event logs, Neo4j graph
│   ├── aiService.ts           # Scoped AI endpoints with ABAC cross-tenant denial
│   └── securityService.ts     # Client-side vector simulation & tamper checks
├── hooks/               # State encapsulation hooks
│   ├── useCart.ts             # Cart lifecycle and subtotal calculation
│   ├── useProducts.ts         # Catalog filtering and active product selection
│   └── useSecuritySentinel.ts # Live telemetry subscription and incident alerts
├── types/               # TypeScript interfaces and contracts
└── data/                # High-fidelity mock seed data
```

---

## 4. Backend Transition Roadmap
The frontend is constructed to decouple components from data fetching:
- All components call functions in `src/services/`.
- Mock fallback data is returned if `VITE_API_BASE_URL` is unavailable or returns an error.
- Setting `VITE_USE_MOCKS=false` in `.env` immediately routes all calls through the live backend endpoints defined in `docs/API_CONTRACTS.md`.
- No UI component makes raw `fetch()` or `axios()` calls directly.

---

## 5. Security Copywriting Rules
In accordance with Rule 7, the frontend strictly forbids exaggerated claims ("100% unhackable", "AI prevents all attacks"). The UI uses precise, audit-grade terminology:
- `Request blocked`
- `Protected resource`
- `Verified seller (KYB Tier 3)`
- `Authorization required (403 Forbidden)`
- `Suspicious activity detected`
- `Cryptographic escrow locked`
- `Escrow signature verified`
