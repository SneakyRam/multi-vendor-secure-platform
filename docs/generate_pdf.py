import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(44, 755, "NEXORA / MARKETHUB — Backend Engineering & API Integration Specification")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(44, 749, 568, 749)
        
        # Footer
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(568, 30, page_str)
        self.drawString(44, 30, "CONFIDENTIAL // TEAM WINE // HACKATHON ENGINEERING HANDOFF")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(44, 40, 568, 40)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=44,
        rightMargin=44,
        topMargin=44,
        bottomMargin=44
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#475569'),
        spaceAfter=10
    )
    
    meta_box = ParagraphStyle(
        'MetaBox',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=5
    )
    
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=12,
        bulletIndent=4,
        spaceAfter=2
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.8,
        leading=10.5,
        textColor=colors.HexColor('#0F172A'),
        backColor=colors.HexColor('#F8FAFC'),
        borderColor=colors.HexColor('#E2E8F0'),
        borderWidth=0.5,
        borderPadding=5,
        spaceBefore=3,
        spaceAfter=5
    )
    
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#1E293B')
    )
    
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Helvetica-Bold'
    )
    
    badge_done = ParagraphStyle(
        'BadgeDone',
        parent=table_cell,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#047857')
    )
    
    badge_todo = ParagraphStyle(
        'BadgeTodo',
        parent=table_cell,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#B45309')
    )

    story = []
    
    # Title Section (Page 1)
    story.append(Paragraph("NEXORA (MARKETHUB)", title_style))
    story.append(Paragraph("Complete Backend Developer Handoff & Phase-by-Phase Integration Guide", subtitle_style))
    story.append(Paragraph("<b>Target Audience:</b> Backend Engineering Lead, Security Architect, DevOps Lead<br/><b>Prepared by:</b> Lead Frontend / Interaction Engineer (Team WINE)<br/><b>Status:</b> Phase 1 (Frontend) & Phase 2 (Contracts & Services) COMPLETED. Ready for backend implementation.", meta_box))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=8))
    
    # Executive Summary
    story.append(Paragraph("1. Executive Architecture Summary", h1_style))
    story.append(Paragraph(
        "NEXORA is a multi-vendor, AI-enabled commerce platform centered on <b>Attribute-Based Access Control (ABAC)</b>, zero-trust cryptographic escrow, and real-time security intelligence. Unlike basic ecommerce websites, NEXORA delivers three tightly integrated user workflows powered by a unified design system and shared backend:",
        body_style
    ))
    story.append(Paragraph("• <b>Customer Experience:</b> Discover → Evaluate → Buy → Track with multi-sig escrow protection.", bullet_style))
    story.append(Paragraph("• <b>Vendor Workspace:</b> Manage listings → Fulfill orders → Monitor escrow payouts (Strictly isolated by merchant tenant ID).", bullet_style))
    story.append(Paragraph("• <b>Admin Sentinel:</b> SIEM threat telemetry → BOLA/IDOR blocking → Interactive Neo4j fraud & identity relationship graph.", bullet_style))
    story.append(Paragraph("• <b>Role-Aware AI Copilot:</b> Scoped by ABAC. Refuses cross-tenant data requests with explicit audit logs.", bullet_style))
    
    story.append(Spacer(1, 4))

    # Phase Roadmap Status Table (Page 1)
    story.append(Paragraph("2. 13-Phase Build Roadmap & Completion Status", h1_style))
    story.append(Paragraph("The exact phase progression outlined in the competition requirements is tracked below:", body_style))
    
    phases_data = [
        [Paragraph("Phase", table_cell_bold), Paragraph("Focus Area", table_cell_bold), Paragraph("Status", table_cell_bold), Paragraph("Deliverables / Responsibilities", table_cell_bold)],
        [Paragraph("PHASE 1", table_cell_bold), Paragraph("Frontend UI & UX", table_cell), Paragraph("COMPLETED", badge_done), Paragraph("Storefront, Vendor Workspace, Admin Sentinel, Touch Mobile Feed, Modals, GSAP zooms", table_cell)],
        [Paragraph("PHASE 2", table_cell_bold), Paragraph("API Contracts & Services", table_cell), Paragraph("COMPLETED", badge_done), Paragraph("Frozen DTOs, apiClient.ts, 5 service classes, useCart/useSecuritySentinel hooks", table_cell)],
        [Paragraph("PHASE 3", table_cell_bold), Paragraph("Authentication", table_cell), Paragraph("BACKEND NEXT", badge_todo), Paragraph("JWT / session tokens, Argon2id passwords, TOTP MFA step-up auth, role claims", table_cell)],
        [Paragraph("PHASE 4", table_cell_bold), Paragraph("PostgreSQL Persistence", table_cell), Paragraph("BACKEND NEXT", badge_todo), Paragraph("Relational schemas for users, vendors, products, escrow orders, and audit events", table_cell)],
        [Paragraph("PHASE 5", table_cell_bold), Paragraph("Authorization (ABAC)", table_cell), Paragraph("BACKEND NEXT", badge_todo), Paragraph("Tenant boundary enforcement: prevent cross-merchant leakage (BOLA / IDOR defense)", table_cell)],
        [Paragraph("PHASE 6", table_cell_bold), Paragraph("Redis Layer", table_cell), Paragraph("BACKEND NEXT", badge_todo), Paragraph("Active sessions, sliding-window rate limiting (120 req/min), temporary escrow locks", table_cell)],
        [Paragraph("PHASE 7", table_cell_bold), Paragraph("Neo4j Fraud Graph", table_cell), Paragraph("BACKEND NEXT", badge_todo), Paragraph("User-Device-IP-Order-Vendor relationships for fraud ring and sybil detection", table_cell)],
        [Paragraph("PHASE 8", table_cell_bold), Paragraph("Security Middleware", table_cell), Paragraph("BACKEND NEXT", badge_todo), Paragraph("Price tampering verification, CSP nonce enforcement, audit logging to SIEM", table_cell)],
        [Paragraph("PHASE 9", table_cell_bold), Paragraph("Role-Scoped AI", table_cell), Paragraph("BACKEND NEXT", badge_todo), Paragraph("LLM integration with ABAC system prompts and cross-tenant inquiry refusal", table_cell)],
        [Paragraph("PHASE 10", table_cell_bold), Paragraph("Live API Integration", table_cell), Paragraph("BACKEND NEXT", badge_todo), Paragraph("Toggle VITE_USE_MOCKS=false; connect services to real backend endpoints", table_cell)],
        [Paragraph("PHASE 11", table_cell_bold), Paragraph("Security & Attack Testing", table_cell), Paragraph("PENDING", badge_todo), Paragraph("Simulate BOLA, CSRF, price manipulation, and test automated blocking", table_cell)],
        [Paragraph("PHASE 12", table_cell_bold), Paragraph("Production Deployment", table_cell), Paragraph("PENDING", badge_todo), Paragraph("Docker Compose (Node/Python, PostgreSQL, Redis, Neo4j, Nginx reverse proxy)", table_cell)],
        [Paragraph("PHASE 13", table_cell_bold), Paragraph("Competition Demo Flow", table_cell), Paragraph("PENDING", badge_todo), Paragraph("Customer buy → Vendor ship → Hacker probe → Admin block → Graph analysis", table_cell)]
    ]
    
    phase_table = Table(phases_data, colWidths=[60, 105, 80, 279])
    phase_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 2.2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.2),
    ]))
    story.append(phase_table)
    
    story.append(PageBreak())
    
    # Section 3: Frontend Architecture & Services (Page 2)
    story.append(Paragraph("3. What Is Completed in the Frontend", h1_style))
    story.append(Paragraph("The frontend is 100% built and compiling cleanly with Vite and TypeScript (0 errors). The directory structure is fully decoupled into services and state hooks so you do not have to touch any React/UI components to wire up your backend:", body_style))
    
    story.append(Paragraph("<b>Decoupled Service Layer (<code>src/services/</code>):</b>", h2_style))
    story.append(Paragraph("• <code>apiClient.ts</code>: Axios/fetch wrapper with Bearer token injection, request ID tracking, and standardized response envelope decoding.<br/>• <code>productService.ts</code>: Product search, category filtering, and product detail endpoints.<br/>• <code>vendorService.ts</code>: Merchant KPIs, inventory level updates, and order fulfillment actions.<br/>• <code>adminService.ts</code>: Live security alerts, probe telemetry, and Neo4j node/edge fetching.<br/>• <code>aiService.ts</code>: Role-aware AI queries with built-in ABAC cross-tenant boundary refusal.<br/>• <code>securityService.ts</code>: Attack vector simulation (price tamper, BOLA, XSS/CSP, CSRF).", body_style))
    
    story.append(Spacer(1, 2))
    story.append(Paragraph("<b>State Encapsulation Hooks (<code>src/hooks/</code>):</b>", h2_style))
    story.append(Paragraph("• <code>useCart.ts</code>: Manages cart state, subtotal math, and client-side price tampering detection.<br/>• <code>useProducts.ts</code>: Handles category switching, search debounce, and active stage selection.<br/>• <code>useSecuritySentinel.ts</code>: Manages real-time SIEM event feeds and Neo4j graph nodes.", body_style))
    
    story.append(Spacer(1, 4))

    # Section 4: Backend API Contract Specifications (Page 2 continues)
    story.append(Paragraph("4. Backend API Contract & DTO Specifications", h1_style))
    story.append(Paragraph("Your backend must implement the following standardized JSON response envelope:", body_style))
    
    envelope_code = """{
  "success": true,
  "data": { ... payload ... },
  "error": { "code": "ERR_STRING", "message": "Human readable description" },
  "meta": { "timestamp": "2026-10-06T00:00:00Z", "requestId": "req_881a", "auditLogged": true }
}"""
    story.append(Paragraph(envelope_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))
    
    story.append(Paragraph("<b>Core Endpoints to Implement:</b>", h2_style))
    
    api_data = [
        [Paragraph("Method & Route", table_cell_bold), Paragraph("Role Required", table_cell_bold), Paragraph("Input Payload / Query", table_cell_bold), Paragraph("Expected Behavior & Protections", table_cell_bold)],
        [Paragraph("GET /api/v1/products", table_cell), Paragraph("Public", table_cell), Paragraph("?category=&q=", table_cell), Paragraph("Return catalog array with price, seller, and stock.", table_cell)],
        [Paragraph("POST /api/v1/checkout", table_cell), Paragraph("Customer", table_cell), Paragraph("{ items, shippingAddress }", table_cell), Paragraph("Recalculate price on server. Reject if client mutated price (422 ERR_PRICE_HASH_MISMATCH). Lock funds in escrow.", table_cell)],
        [Paragraph("GET /api/v1/vendor/metrics", table_cell), Paragraph("Vendor", table_cell), Paragraph("Bearer token", table_cell), Paragraph("Return gross revenue, active listings, escrow balance, seller score.", table_cell)],
        [Paragraph("GET /api/v1/vendor/inventory", table_cell), Paragraph("Vendor", table_cell), Paragraph("Bearer token", table_cell), Paragraph("Enforce ABAC: actor.tenantId == resource.merchantId. Return only this merchant's products.", table_cell)],
        [Paragraph("POST /api/v1/vendor/inventory/:id/stock", table_cell), Paragraph("Vendor", table_cell), Paragraph("{ stock: 20 }", table_cell), Paragraph("Verify resource ownership. Reject cross-tenant updates with 403 Forbidden.", table_cell)],
        [Paragraph("GET /api/v1/admin/sentinel/stats", table_cell), Paragraph("Admin", table_cell), Paragraph("Bearer token", table_cell), Paragraph("Return count of blocked probes (24h), active anomalies, and health status.", table_cell)],
        [Paragraph("GET /api/v1/admin/security/events", table_cell), Paragraph("Admin", table_cell), Paragraph("Bearer token", table_cell), Paragraph("Return live SIEM security logs (timestamp, actor IP, blocked endpoint, severity).", table_cell)],
        [Paragraph("GET /api/v1/admin/security/graph", table_cell), Paragraph("Admin", table_cell), Paragraph("Bearer token", table_cell), Paragraph("Return Neo4j nodes (User, Device, IP, Threat) and edges (CONNECTS_VIA, DISPATCHED).", table_cell)],
        [Paragraph("POST /api/v1/ai/query", table_cell), Paragraph("Any", table_cell), Paragraph("{ prompt, role, tenantId }", table_cell), Paragraph("Role-scoped LLM. If Vendor asks for rival sales, return ABAC refusal.", table_cell)]
    ]
    
    api_table = Table(api_data, colWidths=[105, 60, 115, 244])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(api_table)

    story.append(PageBreak())

    # Section 5: Database Schemas (Page 3)
    story.append(Paragraph("5. Database Models & Persistence Design", h1_style))
    story.append(Paragraph("Your backend database stack consists of three complementary engines:", body_style))
    
    story.append(Paragraph("<b>A. PostgreSQL Relational Schemas (System of Record):</b>", h2_style))
    sql_code = """-- 1. Users Table (Customer, Vendor, Admin)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Argon2id
    role VARCHAR(32) NOT NULL CHECK (role IN ('CUSTOMER', 'VENDOR', 'ADMIN')),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vendors Table (Tenant Entity)
CREATE TABLE vendors (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'VEND-001'
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    kyb_status VARCHAR(32) DEFAULT 'VERIFIED',
    escrow_balance DECIMAL(12,2) DEFAULT 0.00,
    seller_score DECIMAL(4,1) DEFAULT 100.0
);

-- 3. Products Table
CREATE TABLE products (
    id VARCHAR(64) PRIMARY KEY,
    vendor_id VARCHAR(64) REFERENCES vendors(id),
    category VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents > 0),
    stock INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) DEFAULT 'ACTIVE'
);

-- 4. Orders & Escrow Table
CREATE TABLE orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_id UUID REFERENCES users(id),
    total_cents INTEGER NOT NULL,
    escrow_status VARCHAR(32) NOT NULL, -- 'ESCROW_LOCKED', 'RELEASED'
    signature_hash TEXT NOT NULL, -- SHA-256 HMAC
    created_at TIMESTAMPTZ DEFAULT NOW()
);"""
    story.append(Paragraph(sql_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))
    
    story.append(Paragraph("<b>B. Redis Transient Keys:</b>", h2_style))
    story.append(Paragraph("• <code>session:{token}</code> → Hash storing userId, role, tenantId (TTL 24h).<br/>• <code>rate_limit:ip:{client_ip}</code> → Counter sliding window (max 120 req/min). Returns HTTP 429 when breached.<br/>• <code>escrow:lock:{order_id}</code> → Cryptographic escrow challenge verification state.", body_style))
    
    story.append(Paragraph("<b>C. Neo4j Fraud Graph Relationships:</b>", h2_style))
    story.append(Paragraph("• Nodes: <code>(:User)</code>, <code>(:Vendor)</code>, <code>(:Device)</code>, <code>(:IP)</code>, <code>(:Order)</code>, <code>(:Threat)</code><br/>• Edges: <code>(User)-[:LOGGED_IN_FROM]->(Device)-[:CONNECTS_VIA]->(IP)-[:DISPATCHED]->(Threat)</code><br/>• Used by Admin Sentinel to highlight multi-account fraud rings and credential stuffing.", body_style))

    story.append(PageBreak())

    # Section 6: How the Backend Teammate Integrates (Page 4)
    story.append(Paragraph("6. Step-by-Step Integration Guide for Backend Developer", h1_style))
    story.append(Paragraph("Follow these exact steps to connect your backend services to the live frontend:", body_style))
    
    story.append(Paragraph("<b>Step 1 — Create your backend service (Node.js/Express, FastAPI, or Flask):</b><br/>Listen on <code>http://localhost:5000/api/v1</code> (or set your port in <code>.env</code>). Enable CORS for origin <code>http://localhost:5173</code> with credentials enabled.", bullet_style))
    
    story.append(Paragraph("<b>Step 2 — Switch Frontend from Mock to Live API:</b><br/>In <code>BuildSecure-main/BuildSecure-main/.env</code>, change:<br/><code>VITE_DATA_SOURCE=api</code><br/><code>VITE_API_BASE_URL=http://localhost:5000/api/v1</code><br/>The frontend service layer automatically routes all requests to your backend without changing any UI code.", bullet_style))
    
    story.append(Paragraph("<b>Step 3 — Implement Authentication & JWT Bearer Header:</b><br/>Upon login/registration, return <code>{ token: '...', user: { id, role, tenantId } }</code>. The frontend <code>apiClient.ts</code> automatically stores the token and attaches <code>Authorization: Bearer &lt;token&gt;</code> on subsequent calls.", bullet_style))
    
    story.append(Paragraph("<b>Step 4 — Implement ABAC Middlewares:</b><br/>Protect <code>/api/v1/vendor/*</code>: Check that <code>req.user.tenantId === req.params.merchantId</code>. If mismatched, return HTTP 403 with code <code>ERR_ABAC_OWNERSHIP_FAILURE</code>. Log the event to your security SIEM table.", bullet_style))
    
    story.append(Paragraph("<b>Step 5 — Connect AI & Neo4j:</b><br/>For <code>POST /api/v1/ai/query</code>, inspect the caller role. If role is <code>VENDOR</code> and query contains keywords regarding competitors or cross-merchant records, inject the strict system refusal prompt. For <code>GET /api/v1/admin/security/graph</code>, execute a Cypher query returning nodes and relationships.", bullet_style))

    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=8))
    
    story.append(Paragraph("7. Competition Narrative Checklist (Phase 13 Demo)", h1_style))
    story.append(Paragraph("This is the exact sequence to demonstrate to judges to win the competition:", body_style))
    story.append(Paragraph("<b>1. Customer Flow:</b> Browse catalog, select product, examine verified merchant badge, view escrow assurance, and add to bag.", bullet_style))
    story.append(Paragraph("<b>2. Attack Simulation:</b> Disclose an attacker modifying client cart payload to INR 1.00 (₹1) → Backend detects hash mismatch, rejects with HTTP 422, and logs event to SIEM.", bullet_style))
    story.append(Paragraph("<b>3. Vendor Flow:</b> Vendor logs in, inspects inventory, edits stock, and queries AI Copilot: <i>'Show me sales for VEND-002'</i> → AI rejects via ABAC (Zero tenant data leakage).", bullet_style))
    story.append(Paragraph("<b>4. Admin Sentinel Flow:</b> Admin opens command center, observes live 1,429 blocked probes counter, inspects real-time SIEM event, and explores Neo4j fraud ring graph.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == '__main__':
    out_dir = r"c:\Users\saipa\OneDrive\Desktop\hack\BuildSecure-main\BuildSecure-main\docs"
    out_pdf = os.path.join(out_dir, "NEXORA_BACKEND_INTEGRATION_HANDOFF.pdf")
    build_pdf(out_pdf)
    print(f"Generated PDF: {out_pdf}")
    
    root_pdf = r"c:\Users\saipa\OneDrive\Desktop\hack\NEXORA_BACKEND_INTEGRATION_HANDOFF.pdf"
    build_pdf(root_pdf)
    print(f"Generated root PDF: {root_pdf}")
