import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, Activity, Users, Store, AlertOctagon, 
  Terminal, Search, Filter, Lock, Eye, Network, Bot, Send
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'vendor' | 'order' | 'ip' | 'event';
  risk: number; // 0 to 100
  x: number;
  y: number;
  details: string;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  status: 'allowed' | 'blocked' | 'flagged';
}

export const AdminSecurityPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'graph' | 'events' | 'ai'>('matrix');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [eventFilter, setEventFilter] = useState<'all' | 'blocked' | 'allowed'>('all');
  const [adminAiQuery, setAdminAiQuery] = useState('');
  const [adminAiChat, setAdminAiChat] = useState<Array<{ sender: 'admin' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'NEXORA Security Sentinel active. 42 malicious vectors blocked in the last 24h. CSP frame-ancestors locked. Zero unauthorized cross-tenant data requests.'
    }
  ]);

  // Nodes for the interactive Neo4j-style threat relationship graph
  const nodes: GraphNode[] = [
    { id: 'usr-101', label: 'User #101 (Buyer)', type: 'user', risk: 12, x: 120, y: 120, details: 'Verified buyer • 14 orders • Clean trust reputation' },
    { id: 'usr-204', label: 'User #204 (Suspicious)', type: 'user', risk: 87, x: 140, y: 320, details: 'Multiple failed auth attempts • Spoofed User-Agent • Flagged' },
    { id: 'ord-8921', label: 'Order #8921', type: 'order', risk: 5, x: 300, y: 100, details: 'Amount: ₹12,499 • Escrow locked • ECDSA signed' },
    { id: 'ord-9011', label: 'Order #9011 (Tampered)', type: 'order', risk: 94, x: 320, y: 310, details: 'Client price tampering attempt detected and blocked' },
    { id: 'vnd-04', label: 'Vendor Nike Atelier', type: 'vendor', risk: 4, x: 480, y: 140, details: 'Cold storage ECDSA key validated • 4 products • SLA 99.8%' },
    { id: 'vnd-08', label: 'Vendor Sony Acoustic', type: 'vendor', risk: 8, x: 500, y: 280, details: 'Hardware root of trust • 4 products • Zero violations' },
    { id: 'ip-bad', label: 'IP 185.220.101.4', type: 'ip', risk: 91, x: 200, y: 440, details: 'Known Tor exit node • Attempted clickjacking frame overlay' },
    { id: 'sec-xss', label: 'CSP Violation Event', type: 'event', risk: 85, x: 360, y: 450, details: 'Script tag injection blocked by CSP Level 3 policy' },
  ];

  const links: GraphLink[] = [
    { source: 'usr-101', target: 'ord-8921', label: 'PLACED', status: 'allowed' },
    { source: 'ord-8921', target: 'vnd-04', label: 'FULFILLED_BY', status: 'allowed' },
    { source: 'usr-204', target: 'ord-9011', label: 'ATTEMPTED', status: 'blocked' },
    { source: 'usr-204', target: 'ip-bad', label: 'ORIGINATED_FROM', status: 'flagged' },
    { source: 'ip-bad', target: 'sec-xss', label: 'TRIGGERED', status: 'blocked' },
    { source: 'ord-9011', target: 'vnd-08', label: 'TARGETED', status: 'blocked' },
  ];

  const securityEvents = [
    { time: '22:31:04 UTC', actor: 'IP 185.220.101.4', type: 'UI Redressing / Frame Busting', target: '/#stage', decision: 'BLOCKED', severity: 'critical' },
    { time: '22:28:15 UTC', actor: 'User #204', type: 'Client-Side Price Tampering', target: 'Cart Checkout Payload', decision: 'BLOCKED', severity: 'critical' },
    { time: '22:24:50 UTC', actor: 'Anonymous', type: 'Script Injection (XSS)', target: 'Search Query Parameter', decision: 'SANITIZED', severity: 'medium' },
    { time: '22:20:12 UTC', actor: 'Vendor #04', type: 'Cold Storage Ledger Signature', target: 'Catalog Sync', decision: 'ALLOWED', severity: 'low' },
    { time: '22:18:02 UTC', actor: 'User #101', type: 'Escrow Checkout Authentication', target: 'Order #8921', decision: 'ALLOWED', severity: 'low' },
    { time: '22:15:00 UTC', actor: 'Trust Kernel', type: 'SHA-256 Tree Re-Verification', target: '104 Product Assets', decision: 'PASSED', severity: 'low' },
  ];

  const handleSendAdminAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAiQuery.trim()) return;

    const query = adminAiQuery.trim();
    const newChat = [...adminAiChat, { sender: 'admin' as const, text: query }];
    setAdminAiQuery('');

    if (query.toLowerCase().includes('risk') || query.toLowerCase().includes('user #204')) {
      newChat.push({
        sender: 'ai',
        text: 'Investigation Report: User #204 exhibits Risk Score 87. Correlated with Tor exit node IP 185.220.101.4. Attempted client-side price modification and CSP frame-ancestors bypass. Both attempts neutralized.'
      });
    } else if (query.toLowerCase().includes('threat') || query.toLowerCase().includes('blocked')) {
      newChat.push({
        sender: 'ai',
        text: 'Threat Summary: 42 total blocked vectors today. Top mitigations: 1) Strict CSP Level 3 (frame-ancestors none), 2) Object.freeze prototype immunity, 3) ECDSA signature authorization.'
      });
    } else {
      newChat.push({
        sender: 'ai',
        text: `Analysis for "${query}": Marketplace security integrity is optimal. Zero cross-tenant data leakage detected. 100% of merchant keys valid.`
      });
    }

    setAdminAiChat(newChat);
  };

  const filteredEvents = eventFilter === 'all' 
    ? securityEvents 
    : eventFilter === 'blocked' 
    ? securityEvents.filter(e => e.decision === 'BLOCKED' || e.decision === 'SANITIZED')
    : securityEvents.filter(e => e.decision === 'ALLOWED' || e.decision === 'PASSED');

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              <span>NEXORA Sovereign Administration</span>
              <span>•</span>
              <span className="text-rose-700 flex items-center">
                <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                Zero-Trust Risk &amp; Threat Intelligence
              </span>
            </div>
            <h1 className="font-brand font-black text-3xl sm:text-4xl uppercase text-slate-900">
              Security Governance Center
            </h1>
          </div>

          {/* Navigation Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'matrix', label: 'Security Health' },
              { id: 'graph', label: 'Threat Graph' },
              { id: 'events', label: 'Event Ledger' },
              { id: 'ai', label: 'Security AI' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0F172A] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-black hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Executive Security Health */}
        {activeTab === 'matrix' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Entities</span>
                  <div className="font-brand font-black text-2xl sm:text-3xl text-slate-900">14,290</div>
                  <span className="text-xs text-slate-500 font-medium">Buyers, merchants, devices</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Merchants</span>
                  <div className="font-brand font-black text-2xl sm:text-3xl text-emerald-700">20 / 20</div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1" /> 100% ECDSA Signed
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <Store className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Threats Neutralized</span>
                  <div className="font-brand font-black text-2xl sm:text-3xl text-rose-700">42 Blocked</div>
                  <span className="text-xs text-slate-500 font-medium">CSP &amp; heap tampering</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
                  <AlertOctagon className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Security</span>
                  <div className="font-brand font-black text-2xl sm:text-3xl text-emerald-700">100% Pass</div>
                  <span className="text-xs text-emerald-600 font-semibold">OWASP TOP 10 Compliant</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* High Risk Entities Triage */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-brand font-bold text-lg text-slate-900 uppercase">Suspicious Entity Watchlist</h3>
                  <p className="text-xs text-slate-500">Autonomous risk scoring based on telemetry anomalies</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                  1 High Risk Entity Flagged
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">User #204</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[10px] font-bold">
                      Risk Score: 87/100
                    </span>
                    <span className="text-xs text-slate-500 font-mono">IP: 185.220.101.4 (Tor Exit)</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Reasons: Repeated client-side price payload tampering on Order #9011. Blocked by kernel escrow guard.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => { setSelectedNode(nodes[1]); setActiveTab('graph'); }}
                    className="px-3.5 py-1.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    View in Threat Graph ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Neo4j-style Threat Relationship Graph */}
        {activeTab === 'graph' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Graph Canvas / SVG */}
            <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Network className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-brand font-bold text-base text-slate-900 uppercase">
                    Entity Relationship Threat Matrix (Neo4j Schema)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Click any node to inspect risk dossier</span>
              </div>

              {/* Interactive SVG Diagram */}
              <div className="relative w-full h-[460px] bg-slate-50/70 rounded-2xl border border-slate-200/80 overflow-hidden select-none">
                <svg className="w-full h-full">
                  {/* Links */}
                  {links.map((link, i) => {
                    const s = nodes.find(n => n.id === link.source);
                    const t = nodes.find(n => n.id === link.target);
                    if (!s || !t) return null;
                    return (
                      <g key={i}>
                        <line
                          x1={s.x}
                          y1={s.y}
                          x2={t.x}
                          y2={t.y}
                          stroke={link.status === 'blocked' ? '#ef4444' : link.status === 'flagged' ? '#f59e0b' : '#10b981'}
                          strokeWidth={2}
                          strokeDasharray={link.status === 'blocked' ? '4 4' : undefined}
                        />
                        <text
                          x={(s.x + t.x) / 2}
                          y={(s.y + t.y) / 2 - 6}
                          fontSize={9}
                          fontWeight="bold"
                          fill="#64748b"
                          textAnchor="middle"
                        >
                          {link.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {nodes.map(n => {
                    const isSelected = selectedNode?.id === n.id;
                    const isHighRisk = n.risk > 70;
                    return (
                      <g
                        key={n.id}
                        transform={`translate(${n.x}, ${n.y})`}
                        onClick={() => setSelectedNode(n)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        <circle
                          r={isSelected ? 24 : 18}
                          fill={isHighRisk ? '#fee2e2' : '#f0fdf4'}
                          stroke={isHighRisk ? '#ef4444' : '#10b981'}
                          strokeWidth={isSelected ? 3 : 2}
                        />
                        <text
                          y={4}
                          fontSize={10}
                          fontWeight="bold"
                          fill="#0f172a"
                          textAnchor="middle"
                        >
                          {n.risk}
                        </text>
                        <text
                          y={30}
                          fontSize={10}
                          fontWeight="600"
                          fill="#334155"
                          textAnchor="middle"
                        >
                          {n.label.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Graph Legend */}
              <div className="flex items-center space-x-6 text-xs text-slate-500 pt-2">
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" /> Verified Entity (Low Risk)</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5" /> Anomalous / Blocked (High Risk)</span>
              </div>
            </div>

            {/* Right Col: Entity Risk Dossier */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="font-brand font-bold text-base text-slate-900 uppercase pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Entity Risk Dossier</span>
                {selectedNode && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedNode.risk > 70 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Score: {selectedNode.risk}/100
                  </span>
                )}
              </h4>

              {selectedNode ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Entity Label</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedNode.label}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Entity Type</span>
                    <span className="font-mono uppercase font-semibold text-slate-700">{selectedNode.type}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">Telemetry Notes</span>
                    <p className="text-slate-700 leading-relaxed">{selectedNode.details}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-slate-400 block uppercase text-[10px] font-semibold">Security Action</span>
                    {selectedNode.risk > 70 ? (
                      <button className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer shadow-xs">
                        Block Entity Globally
                      </button>
                    ) : (
                      <button className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 cursor-pointer">
                        Export Provenance Proof ↗
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-400">
                  Select any node in the graph matrix to view its live behavioral risk dossier.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 3: Security Event Ledger */}
        {activeTab === 'events' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-brand font-bold text-xl uppercase text-slate-900">
                  Cryptographic Security Event Stream
                </h3>
                <p className="text-xs text-slate-500">Live immutable ledger of client and edge authorization policies</p>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                {(['all', 'blocked', 'allowed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setEventFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize cursor-pointer transition-all ${
                      eventFilter === f ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Origin / Actor</th>
                    <th className="pb-3">Event Type</th>
                    <th className="pb-3">Target Scope</th>
                    <th className="pb-3">Policy Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((evt, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-mono text-slate-500">{evt.time}</td>
                      <td className="py-3 font-bold text-slate-800">{evt.actor}</td>
                      <td className="py-3 text-slate-700 font-medium">{evt.type}</td>
                      <td className="py-3 font-mono text-slate-600">{evt.target}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          evt.decision === 'BLOCKED' ? 'bg-rose-100 text-rose-800' :
                          evt.decision === 'SANITIZED' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {evt.decision}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Admin AI Copilot */}
        {activeTab === 'ai' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-brand font-bold text-xl uppercase text-slate-900 flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-rose-600" />
                  <span>NEXORA Sovereign Security Intelligence Copilot</span>
                </h3>
                <p className="text-xs text-slate-500">Autonomous correlation of cross-tenant events and threat patterns.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                Admin Sentinel
              </span>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 self-center font-medium">Investigate:</span>
              <button 
                onClick={() => setAdminAiQuery('Show me high-risk entities and anomalies.')}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 cursor-pointer"
              >
                "Show high-risk entities"
              </button>
              <button 
                onClick={() => setAdminAiQuery('Summarize blocked authorization and CSP events today.')}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 cursor-pointer"
              >
                "Summarize blocked exploits"
              </button>
            </div>

            {/* Chat Box */}
            <div className="rounded-2xl bg-slate-50 p-4 min-h-[300px] max-h-[420px] overflow-y-auto space-y-3 text-xs">
              {adminAiChat.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl max-w-xl ${
                    msg.sender === 'admin'
                      ? 'ml-auto bg-[#0F172A] text-white'
                      : 'mr-auto bg-white border border-slate-200 text-slate-800 shadow-2xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSendAdminAi} className="flex gap-2">
              <input
                type="text"
                value={adminAiQuery}
                onChange={e => setAdminAiQuery(e.target.value)}
                placeholder="Ask about malicious actors, CSP violations, or merchant key state..."
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <span>Investigate</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
