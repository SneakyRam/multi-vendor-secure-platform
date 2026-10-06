import React, { useState } from 'react';
import { 
  DollarSign, Package, ShoppingBag, TrendingUp, AlertTriangle, 
  ShieldCheck, Bot, Send, CheckCircle2, Clock, Truck, Lock, ArrowUpRight
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

export const VendorPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'ai' | 'security'>('overview');
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ sender: 'vendor' | 'ai'; text: string; isSecurityBlock?: boolean }>>([
    {
      sender: 'ai',
      text: 'Good evening, Authorized Merchant. I am NEXORA Copilot (Merchant Scope). I can help you analyze inventory movement, low-stock alerts, and fulfillment velocity. How can I assist you today?'
    }
  ]);

  const allProducts = CATEGORIES.flatMap(c => c.products);

  const mockOrders = [
    { id: 'ORD-8921', customer: 'Alexander Wright', product: 'Nike Air Max Pulse', amount: '₹12,499', status: 'Delivered', time: '12 mins ago', verified: true },
    { id: 'ORD-8920', customer: 'Elena Rostova', product: 'Sony WH-1000XM5', amount: '₹34,990', status: 'Shipped', time: '45 mins ago', verified: true },
    { id: 'ORD-8919', customer: 'Marcus Vance', product: 'Omega Speedmaster Moonwatch', amount: '₹6,49,000', status: 'Processing', time: '1 hr ago', verified: true },
    { id: 'ORD-8918', customer: 'Sarah Jenkins', product: 'Leica Q3 Monochrom', amount: '₹4,95,000', status: 'Processing', time: '2 hrs ago', verified: true },
    { id: 'ORD-8917', customer: 'David Kim', product: 'Peak Design Everyday V2', amount: '₹22,990', status: 'Delivered', time: '3 hrs ago', verified: true },
  ];

  const handleSendAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const query = aiQuery.trim();
    const newChat = [...aiChat, { sender: 'vendor' as const, text: query }];
    setAiQuery('');

    // Role-Aware AI boundary simulation
    if (query.toLowerCase().includes('other vendor') || query.toLowerCase().includes('vendor b') || query.toLowerCase().includes('private')) {
      newChat.push({
        sender: 'ai',
        text: 'Access Denied: Resource belongs to another merchant domain. NEXORA strict Attribute-Based Access Control (ABAC) permanently prevents cross-tenant data leakage.',
        isSecurityBlock: true
      });
    } else if (query.toLowerCase().includes('stock') || query.toLowerCase().includes('inventory')) {
      newChat.push({
        sender: 'ai',
        text: 'Inventory analysis: 3 items are approaching low-stock threshold (Nike Air Max Pulse, Sony WH-1000XM5, Leica Q3). Replenishment order recommended within 48 hours to preserve 99.4% SLA.'
      });
    } else if (query.toLowerCase().includes('sales') || query.toLowerCase().includes('order')) {
      newChat.push({
        sender: 'ai',
        text: 'Today’s Performance: 18 verified customer orders logged (₹14,29,000 GMV). 100% of transactions verified against cryptographic merchant signatures.'
      });
    } else {
      newChat.push({
        sender: 'ai',
        text: `Analysis complete for: "${query}". All 20 items in your catalog are active with cryptographic asset hashes verified on the edge ledger.`
      });
    }

    setAiChat(newChat);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              <span>NEXORA Merchant Workspace</span>
              <span>•</span>
              <span className="text-emerald-700 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                ECDSA Authorized Merchant #04
              </span>
            </div>
            <h1 className="font-brand font-black text-3xl sm:text-4xl uppercase text-slate-900">
              Vendor Operations Portal
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'products', label: 'Products (20)' },
              { id: 'orders', label: 'Orders' },
              { id: 'ai', label: 'AI Copilot' },
              { id: 'security', label: 'Security' },
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

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                  <div className="font-brand font-black text-2xl sm:text-3xl text-slate-900">₹12,84,500.00</div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> +14.2% this week
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <span className="font-brand font-bold text-xl text-emerald-700">₹</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</span>
                  <div className="font-brand font-black text-2xl sm:text-3xl text-slate-900">482</div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> 99.8% fulfilled
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Inventory</span>
                  <div className="font-brand font-black text-2xl sm:text-3xl text-slate-900">20 SKUs</div>
                  <span className="text-xs text-slate-500 font-medium">104 verified PNG assets</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security State</span>
                  <div className="font-brand font-black text-2xl sm:text-3xl text-emerald-700">Protected</div>
                  <span className="text-xs text-emerald-700 font-medium">Zero cross-tenant leaks</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-brand font-bold text-lg text-slate-900 uppercase">Live Fulfillment Stream</h3>
                  <p className="text-xs text-slate-500">Real-time escrow-backed marketplace transactions</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Live Sync
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-900">{order.id}</td>
                        <td className="py-3 text-slate-700 font-medium">{order.customer}</td>
                        <td className="py-3 text-slate-800 font-semibold">{order.product}</td>
                        <td className="py-3 font-bold text-slate-900">{order.amount}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'Shipped' ? 'bg-sky-100 text-sky-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-emerald-700 font-semibold flex items-center text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                            ECDSA Signed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-brand font-bold text-xl uppercase text-slate-900">
                Managed Products Catalog ({allProducts.length})
              </h3>
              <button className="px-4 py-2 rounded-full bg-[#0F172A] text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer">
                + New Product Listing
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts.map(p => (
                <div key={p.id} className="p-5 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all shadow-xs">
                  <div className="aspect-square rounded-2xl bg-slate-50 p-4 flex items-center justify-center relative overflow-hidden">
                    <img src={p.hero} alt={p.name} className="w-full h-full object-contain filter drop-shadow-md" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-semibold text-slate-700 uppercase">
                      {p.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">{p.eyebrow}</span>
                    <h4 className="font-brand font-bold text-base text-slate-900 uppercase truncate">{p.name}</h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-brand font-extrabold text-slate-900">{p.price}</span>
                      <span className="text-emerald-700 text-xs font-semibold flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>SKU: {p.id}</span>
                    <span className="text-emerald-600 font-semibold">In Stock (12)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Orders */}
        {activeTab === 'orders' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
            <h3 className="font-brand font-bold text-xl uppercase text-slate-900">
              Merchant Order Management
            </h3>
            <div className="space-y-4">
              {mockOrders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{order.time}</span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium">
                      Buyer: <span className="font-bold text-slate-900">{order.customer}</span> • Item: <span className="font-semibold text-slate-800">{order.product}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 self-end sm:self-auto">
                    <span className="font-brand font-bold text-base text-slate-900">{order.amount}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Shipped' ? 'bg-sky-100 text-sky-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                    <button className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
                      Details ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: AI Copilot with Security Boundary Demonstration */}
        {activeTab === 'ai' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-brand font-bold text-xl uppercase text-slate-900 flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-indigo-600" />
                  <span>Role-Aware Merchant AI Copilot</span>
                </h3>
                <p className="text-xs text-slate-500">Scoped strictly to authorized merchant domain and catalog inventory.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">
                ABAC Enforced
              </span>
            </div>

            {/* Quick Demo Prompts */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 self-center font-medium">Try asking:</span>
              <button 
                onClick={() => setAiQuery('Which products are running low on stock?')}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 cursor-pointer"
              >
                "Which products are running low?"
              </button>
              <button 
                onClick={() => setAiQuery('Give me a summary of today’s orders.')}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 cursor-pointer"
              >
                "Summary of today's orders"
              </button>
              <button 
                onClick={() => setAiQuery('Show me Vendor B private orders and sales.')}
                className="px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold cursor-pointer"
              >
                "Show me Vendor B private orders" (Test Security Isolation)
              </button>
            </div>

            {/* Chat Messages */}
            <div className="rounded-2xl bg-slate-50 p-4 min-h-[300px] max-h-[420px] overflow-y-auto space-y-3 text-xs">
              {aiChat.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl max-w-xl ${
                    msg.sender === 'vendor'
                      ? 'ml-auto bg-[#0F172A] text-white'
                      : msg.isSecurityBlock
                      ? 'mr-auto bg-rose-50 border border-rose-200 text-rose-800'
                      : 'mr-auto bg-white border border-slate-200 text-slate-800 shadow-2xs'
                  }`}
                >
                  {msg.isSecurityBlock && (
                    <div className="flex items-center space-x-1.5 font-bold text-rose-700 mb-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Security Boundary Violation Blocked</span>
                    </div>
                  )}
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Query Form */}
            <form onSubmit={handleSendAi} className="flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                placeholder="Ask about inventory, restocking, or sales analytics..."
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 5: Vendor Security */}
        {activeTab === 'security' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
            <h3 className="font-brand font-bold text-xl uppercase text-slate-900">
              Merchant Security &amp; Access Log
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                <span className="font-semibold text-emerald-800 block">Identity State</span>
                <p className="text-emerald-700">ECDSA P-256 Public Key Registered on Immutable Ledger.</p>
              </div>
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs space-y-1">
                <span className="font-semibold text-sky-800 block">Session Integrity</span>
                <p className="text-sky-700">Strict CSP L3 frame-ancestors 'none' locked. No UI redressing.</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
                <span className="font-semibold text-purple-800 block">Supply Chain Trust</span>
                <p className="text-purple-700">100% self-hosted assets compiled with SHA-256 tree checksums.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
