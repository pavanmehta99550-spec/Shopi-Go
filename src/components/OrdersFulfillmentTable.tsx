import React, { useState } from 'react';
import { 
  Package, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Bot, 
  Layers, 
  User, 
  MapPin, 
  Phone,
  Terminal,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Hourglass,
  RotateCcw,
  Landmark,
  Coins,
  ArrowRight,
  Send,
  Navigation,
  CheckCircle,
  CircleDashed,
  Filter
} from 'lucide-react';
import { CustomerOrder, MeeshoShippingStage } from '../types/dropship';

interface OrdersFulfillmentTableProps {
  orders: CustomerOrder[];
  onRetryForward: (orderId: string) => void;
  onOrderUpdated?: (order: CustomerOrder) => void;
}

export const OrdersFulfillmentTable: React.FC<OrdersFulfillmentTableProps> = ({
  orders,
  onRetryForward,
  onOrderUpdated
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  
  // Status filter state: 'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');

  // Supplier shipping update form states per expanded order
  const [shippingForm, setShippingForm] = useState<{
    shippingStage: MeeshoShippingStage;
    courierPartner: 'Delhivery' | 'Shadowfax' | 'Ecom Express' | 'XpressBees' | 'BlueDart';
    awbNumber: string;
    location: string;
    note: string;
  }>({
    shippingStage: 'SHIPPED_FROM_MEESHO',
    courierPartner: 'Delhivery',
    awbNumber: '',
    location: 'Delhi Sorting Hub',
    note: 'Handed over to delivery courier.'
  });

  const [shippingSuccessMsg, setShippingSuccessMsg] = useState<string | null>(null);
  const [copiedOrderNotice, setCopiedOrderNotice] = useState<string | null>(null);

  // 1-Click Buy on Meesho: Copies formatted address & opens product link
  const handleOpenAndCopyMeeshoOrder = (order: CustomerOrder) => {
    const it = order.items[0];
    const sourceLink = it?.sourceUrl || "https://www.meesho.com";
    
    // Format full address for 1-second paste
    const formattedAddress = `Name: ${order.customer.fullName}\nPhone: ${order.customer.phone}\nAddress: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}\nItem: ${it?.productTitle}\nSize: ${it?.selectedSize || 'Free'}\nQty: ${it?.quantity || 1}`;
    
    try {
      navigator.clipboard.writeText(formattedAddress);
    } catch (e) {}

    setCopiedOrderNotice(`📋 Customer Address Copied! Opening Meesho link for: ${it?.productTitle}...`);
    setTimeout(() => setCopiedOrderNotice(null), 5000);

    // Open Meesho source link in new tab
    window.open(sourceLink, '_blank', 'noopener,noreferrer');
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => {
      const next = prev === id ? null : id;
      if (next) {
        const order = orders.find(o => o.id === next);
        if (order) {
          setShippingForm({
            shippingStage: order.shippingStage || 'SHIPPED_FROM_MEESHO',
            courierPartner: order.courierPartner || 'Delhivery',
            awbNumber: order.meeshoAwbNumber || `DLVRY-${Math.floor(100000 + Math.random() * 900000)}`,
            location: order.currentLocation || 'Delhi Fulfillment Center',
            note: ''
          });
        }
      }
      return next;
    });
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalRetailAmount, 0);
  const totalCost = orders.reduce((sum, o) => sum + o.totalSupplierCost, 0);
  const totalAdminCommission = orders.reduce((sum, o) => sum + (o.adminCommission || (o.totalRetailAmount * 0.075)), 0);
  const totalProfit = totalRevenue - totalCost;

  // Release payout to seller
  const handleReleasePayout = async (orderId: string) => {
    setActionLoadingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/release-to-seller`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success && onOrderUpdated) {
        onOrderUpdated(data.order);
      }
    } catch (e) {
      console.warn("Release failed:", e);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Customer Return initiation
  const handleCustomerReturn = async (orderId: string) => {
    if (!window.confirm("Kya aap customer ke 7-Day Return ko confirm karna chahte hain? Supplier ka payout cancel ho jayega aur buyer ko refund hoga.")) return;
    setActionLoadingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/customer-return`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success && onOrderUpdated) {
        onOrderUpdated(data.order);
      }
    } catch (e) {
      console.warn("Return failed:", e);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Supplier / Admin Cancels Order
  const handleCancelOrder = async (orderId: string) => {
    const reason = window.prompt("Order cancel karne ka reason enter karein (e.g. Out of stock / Customer requested):", "Supplier cancelled order");
    if (!reason || !reason.trim()) return;

    setActionLoadingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim(), cancelledBy: 'SUPPLIER' })
      });
      const data = await res.json();
      if (res.ok && data.success && onOrderUpdated) {
        onOrderUpdated(data.order);
      }
    } catch (e) {
      console.warn("Cancel failed:", e);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Supplier Updates Real-time Meesho Shipping Status
  const handleUpdateShipping = async (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    setActionLoadingId(orderId);
    setShippingSuccessMsg(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/shipping-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shippingForm)
      });
      const data = await res.json();
      if (res.ok && data.success && onOrderUpdated) {
        onOrderUpdated(data.order);
        setShippingSuccessMsg(data.message);
        setTimeout(() => setShippingSuccessMsg(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStageBadge = (stage: MeeshoShippingStage) => {
    switch (stage) {
      case 'ORDER_CONFIRMED':
        return <span className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold">1. Confirmed</span>;
      case 'SHIPPED_FROM_MEESHO':
        return <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold">2. Shipped</span>;
      case 'IN_TRANSIT':
        return <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold">3. In Transit</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold animate-pulse">4. Out for Delivery</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold">5. Delivered ✅</span>;
      case 'RETURNED_REFUNDED':
        return <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold">Returned & Refunded</span>;
      case 'CANCELLED':
        return <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold">🚫 Cancelled</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[9px] font-mono">{stage}</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Metrics Row with Escrow and Platform Fee breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <div className="text-xs font-mono text-slate-400">Total Buyer Payments</div>
          <div className="text-2xl font-black text-white font-mono">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-mono">100% in Admin Escrow Account</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1 shadow-lg">
          <div className="text-xs font-mono text-amber-400 flex items-center justify-between">
            <span>Admin Platform Fees</span>
            <Coins className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">₹{Math.round(totalAdminCommission).toLocaleString()}</div>
          <div className="text-[10px] text-amber-400/80 font-mono">Platform fee (7.5%)</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-1 shadow-lg">
          <div className="text-xs font-mono text-cyan-400 flex items-center justify-between">
            <span>Pending 7-Day Escrow</span>
            <Hourglass className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            ₹{orders.filter(o => o.escrowStatus !== 'SETTLED_TO_SELLER' && !o.isReturned).reduce((s, o) => s + (o.sellerPayoutAmount || 0), 0)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Released only if no return</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-1 shadow-lg">
          <div className="text-xs font-mono text-emerald-400 font-bold">Total Net Profit Spread</div>
          <div className="text-2xl font-black text-emerald-300 font-mono">+₹{totalProfit.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400/80 font-mono font-bold">Wholesale margin spread</div>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-pink-400" />
              <span>Meesho Shipping Dispatch & Live Tracking Gateway</span>
            </h3>
            <p className="text-xs text-slate-400">
              Yahan se Supplier order ka <strong>Meesho Shipping Status</strong> update kar sakta hai (Shipped, In Transit, Out for Delivery, Delivered) jo customer ko real-time dikhega.
            </p>
          </div>

          <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Live Courier Sync: Active</span>
          </div>
        </div>

        {/* Filter Bar Above Table for Suppliers */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-300">Filter Orders by Status:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Pending', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => {
              const count = st === 'All' 
                ? orders.length 
                : orders.filter(o => {
                    const key = o.shippingStage === 'DELIVERED' ? 'Delivered' :
                      o.shippingStage === 'SHIPPED_FROM_MEESHO' || o.shippingStage === 'IN_TRANSIT' || o.shippingStage === 'OUT_FOR_DELIVERY' ? 'Shipped' :
                      o.shippingStage === 'ORDER_CONFIRMED' && o.deliveryStatus === 'PROCESSING' ? 'Processing' :
                      o.forwardingStatus === 'PENDING' ? 'Pending' : 'Processing';
                    return key === st;
                  }).length;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    statusFilter === st
                      ? st === 'Delivered'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50 shadow-emerald-950'
                        : st === 'Shipped'
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/50 shadow-indigo-950'
                        : st === 'Processing'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400/50 shadow-blue-950'
                        : st === 'Pending'
                        ? 'bg-amber-600 text-slate-950 font-black ring-2 ring-amber-400/50 shadow-amber-950'
                        : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white ring-2 ring-pink-400/50'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{st === 'All' ? 'All Orders' : st}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    statusFilter === st ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1-Click Meesho Order Copy Success Notice */}
        {copiedOrderNotice && (
          <div className="p-3.5 rounded-2xl bg-pink-950/80 border border-pink-500/60 text-pink-200 text-xs flex items-center gap-3 animate-fade-in font-mono shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
            <div className="flex-1 font-bold">{copiedOrderNotice}</div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="font-bold text-white text-sm">No orders yet</h4>
            <p className="text-xs text-slate-400">Customer storefront se buy now karke order place karein.</p>
          </div>
        ) : (
          <div id="orders-table-body" className="space-y-3">
            {orders
              .filter(order => {
                if (statusFilter === 'All') return true;
                const key = 
                  order.shippingStage === 'DELIVERED' ? 'Delivered' :
                  order.shippingStage === 'SHIPPED_FROM_MEESHO' || order.shippingStage === 'IN_TRANSIT' || order.shippingStage === 'OUT_FOR_DELIVERY' ? 'Shipped' :
                  order.shippingStage === 'ORDER_CONFIRMED' && order.deliveryStatus === 'PROCESSING' ? 'Processing' :
                  order.forwardingStatus === 'PENDING' ? 'Pending' : 'Processing';
                return key === statusFilter;
              })
              .map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const isReturned = order.isReturned || order.escrowStatus === 'REFUNDED_TO_CUSTOMER';
              const isSettled = order.escrowStatus === 'SETTLED_TO_SELLER';

              // Convert internal shippingStage to one of 'Pending', 'Processing', 'Shipped', 'Delivered'
              const currentStatusKey = 
                order.shippingStage === 'DELIVERED' ? 'Delivered' :
                order.shippingStage === 'SHIPPED_FROM_MEESHO' || order.shippingStage === 'IN_TRANSIT' || order.shippingStage === 'OUT_FOR_DELIVERY' ? 'Shipped' :
                order.shippingStage === 'ORDER_CONFIRMED' && order.deliveryStatus === 'PROCESSING' ? 'Processing' :
                order.forwardingStatus === 'PENDING' ? 'Pending' : 'Processing';

              return (
                <div
                  key={order.id}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isReturned 
                      ? 'border-red-900/50 bg-red-950/10' 
                      : isSettled
                      ? 'border-emerald-900/50 bg-slate-950/80'
                      : isExpanded 
                      ? 'border-purple-500/60 bg-slate-950/90 shadow-xl' 
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  {/* Order Card Header */}
                  <div
                    onClick={() => toggleExpand(order.id)}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-white font-mono">{order.orderNumber}</span>
                          
                          {/* QUICK DROPDOWN MENU FOR STATUS COLUMN */}
                          <div 
                            className="relative inline-flex items-center"
                            onClick={(e) => e.stopPropagation()} // Prevent card accordion toggle when clicking dropdown
                          >
                            <label className="sr-only">Status</label>
                            <select
                              value={currentStatusKey}
                              disabled={actionLoadingId === order.id}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                setActionLoadingId(order.id);
                                try {
                                  const res = await fetch(`/api/orders/${order.id}/shipping-status`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ shippingStage: newStatus })
                                  });
                                  const data = await res.json();
                                  if (res.ok && data.success && onOrderUpdated) {
                                    onOrderUpdated(data.order);
                                  }
                                } catch (err) {
                                  console.error("Status update error:", err);
                                } finally {
                                  setActionLoadingId(null);
                                }
                              }}
                              className={`appearance-none cursor-pointer pl-2.5 pr-7 py-1 rounded-lg text-[10px] font-mono font-black border transition-all shadow-sm ${
                                currentStatusKey === 'Delivered'
                                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 hover:border-emerald-400 focus:ring-emerald-500'
                                  : currentStatusKey === 'Shipped'
                                  ? 'bg-indigo-950/90 text-indigo-300 border-indigo-500 hover:border-indigo-400 focus:ring-indigo-500'
                                  : currentStatusKey === 'Processing'
                                  ? 'bg-blue-950/90 text-blue-300 border-blue-500 hover:border-blue-400 focus:ring-blue-500'
                                  : 'bg-amber-950/90 text-amber-300 border-amber-500 hover:border-amber-400 focus:ring-amber-500'
                              } focus:outline-none focus:ring-2`}
                            >
                              <option value="Pending">⏳ Pending</option>
                              <option value="Processing">⚙️ Processing</option>
                              <option value="Shipped">🚚 Shipped</option>
                              <option value="Delivered">✅ Delivered</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
                          </div>

                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            order.paymentMethod === 'ONLINE_UPI'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {order.paymentMethod === 'ONLINE_UPI' ? '⚡ UPI QR PAID' : '🚚 COD'}
                          </span>

                          {/* Escrow Status Badge */}
                          {isReturned ? (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold bg-red-950 text-red-300 border border-red-800">
                              REFUNDED (RETURNED)
                            </span>
                          ) : isSettled ? (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              SETTLED TO SUPPLIER
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                              <Hourglass className="w-2.5 h-2.5" />
                              <span>7-DAY ESCROW HOLD</span>
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 pt-0.5 font-mono">
                          <span>{order.customer.fullName} ({order.customer.city})</span>
                          <span>•</span>
                          <span className="text-white">AWB: {order.meeshoAwbNumber || 'Generating...'}</span>
                          <span>•</span>
                          <span className="text-cyan-300">{order.courierPartner || 'Delhivery'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-mono">Total Order Value</div>
                        <div className="font-black text-sm text-white font-mono">₹{order.totalRetailAmount}</div>
                      </div>

                      {/* 1-Click Order on Meesho Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAndCopyMeeshoOrder(order);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-pink-600/30 transition-all cursor-pointer shrink-0"
                        title="Open Meesho product page with customer address copied to clipboard"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>🛒 Order on Meesho</span>
                      </button>

                      {/* Expand Arrow */}
                      <button className="p-1 rounded-lg text-slate-400 hover:text-white">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-2 space-y-5 border-t border-slate-900 bg-slate-950/70 animate-fade-in text-xs">
                      {/* ========================================================================= */}
                      {/* SECTION 1: SUPPLIER SHIPPING STATUS UPDATE CONTROLS (Live Sync with Buyer) */}
                      {/* ========================================================================= */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-950 border border-cyan-500/40 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-cyan-900/50">
                          <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-cyan-400" />
                            <h4 className="font-bold text-white text-xs font-mono uppercase">
                              Supplier Shipping & Meesho Courier Status Updater
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-700 font-bold">
                            Live Synced to Buyer Store
                          </span>
                        </div>

                        <form onSubmit={(e) => handleUpdateShipping(e, order.id)} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-slate-300 font-bold">Update Shipping Stage *</label>
                              <select
                                value={shippingForm.shippingStage}
                                onChange={(e) => setShippingForm({ ...shippingForm, shippingStage: e.target.value as MeeshoShippingStage })}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                              >
                                <option value="ORDER_CONFIRMED">1. Order Confirmed & Processed</option>
                                <option value="SHIPPED_FROM_MEESHO">2. Shipped from Meesho Warehouse</option>
                                <option value="IN_TRANSIT">3. In Transit (Between Hubs)</option>
                                <option value="OUT_FOR_DELIVERY">4. Out for Doorstep Delivery</option>
                                <option value="DELIVERED">5. Delivered to Customer (Triggers 7-Day Escrow)</option>
                                <option value="RETURNED_REFUNDED">6. Returned by Customer (Full Refund)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-slate-300 font-bold">Courier Partner</label>
                              <select
                                value={shippingForm.courierPartner}
                                onChange={(e) => setShippingForm({ ...shippingForm, courierPartner: e.target.value as any })}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                              >
                                <option value="Delhivery">Delhivery Surface / Air</option>
                                <option value="Shadowfax">Shadowfax Express</option>
                                <option value="Ecom Express">Ecom Express</option>
                                <option value="XpressBees">XpressBees Logistics</option>
                                <option value="BlueDart">Blue Dart Apex</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-slate-300 font-bold">Courier AWB / Tracking No.</label>
                              <input
                                type="text"
                                value={shippingForm.awbNumber}
                                onChange={(e) => setShippingForm({ ...shippingForm, awbNumber: e.target.value })}
                                placeholder="e.g. DLVRY-989201"
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-slate-300 font-bold">Current Hub / Checkpoint Location</label>
                              <input
                                type="text"
                                value={shippingForm.location}
                                onChange={(e) => setShippingForm({ ...shippingForm, location: e.target.value })}
                                placeholder="e.g. Jaipur Main Sorting Hub"
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-slate-300 font-bold">Tracking Note / Milestone Description</label>
                              <input
                                type="text"
                                value={shippingForm.note}
                                onChange={(e) => setShippingForm({ ...shippingForm, note: e.target.value })}
                                placeholder="e.g. Package dispatched on express flight to destination"
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                              />
                            </div>
                          </div>

                          {shippingSuccessMsg && (
                            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>{shippingSuccessMsg}</span>
                            </div>
                          )}

                          <div className="flex justify-end pt-1">
                            <button
                              type="submit"
                              disabled={actionLoadingId === order.id}
                              className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono flex items-center gap-2 shadow-lg disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{actionLoadingId === order.id ? 'Updating...' : 'PUSH SHIPPING UPDATE TO BUYER TRACKING'}</span>
                            </button>
                          </div>
                        </form>

                        {/* Real-time Visual Tracking Stepper for this order */}
                        <div className="pt-2 border-t border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-2">Live Timeline:</div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {[
                              { id: 'ORDER_CONFIRMED', label: '1. Confirmed' },
                              { id: 'SHIPPED_FROM_MEESHO', label: '2. Shipped' },
                              { id: 'IN_TRANSIT', label: '3. In Transit' },
                              { id: 'OUT_FOR_DELIVERY', label: '4. Out for Delivery' },
                              { id: 'DELIVERED', label: '5. Delivered' }
                            ].map((step, idx) => {
                              const stages = ['ORDER_CONFIRMED', 'SHIPPED_FROM_MEESHO', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
                              const currentIdx = stages.indexOf(order.shippingStage || 'ORDER_CONFIRMED');
                              const isPastOrCurrent = idx <= currentIdx;
                              const isCurrent = idx === currentIdx;

                              return (
                                <div
                                  key={step.id}
                                  className={`p-2 rounded-xl border text-center transition-all ${
                                    isCurrent
                                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/30'
                                      : isPastOrCurrent
                                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                                      : 'bg-slate-950/40 border-slate-800 text-slate-600'
                                  }`}
                                >
                                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1">
                                    {isPastOrCurrent ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <CircleDashed className="w-3 h-3 text-slate-600" />}
                                    <span>{step.label}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Escrow Rule Alert Box */}
                      <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Escrow Settlement Guarantee (Protected by Admin Pavan):</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            Buyer Paid: <strong>₹{order.totalRetailAmount}</strong>. Admin Platform Cut: <strong>₹{order.adminCommission || 33}</strong>. 
                            Supplier Share: <strong>₹{order.sellerPayoutAmount || 215}</strong> (Held until 7-Day return window expires).
                          </p>
                        </div>

                        {/* Escrow Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {!isReturned && !isSettled && order.shippingStage !== 'CANCELLED' && (
                            <>
                              <button
                                type="button"
                                disabled={actionLoadingId === order.id}
                                onClick={() => handleReleasePayout(order.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[11px] flex items-center gap-1 shadow"
                                title="Release payout after return period"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Release Payout</span>
                              </button>

                              <button
                                type="button"
                                disabled={actionLoadingId === order.id}
                                onClick={() => handleCustomerReturn(order.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 font-mono font-bold text-[11px] flex items-center gap-1"
                                title="Mark as returned: 100% refund to buyer, 0 to supplier"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Return (Refund Buyer)</span>
                              </button>

                              <button
                                type="button"
                                disabled={actionLoadingId === order.id}
                                onClick={() => handleCancelOrder(order.id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300 font-mono font-bold text-[11px] flex items-center gap-1"
                                title="Cancel order and halt fulfillment"
                              >
                                <span>🚫 Cancel Order</span>
                              </button>
                            </>
                          )}
                          {order.shippingStage === 'CANCELLED' && (
                            <span className="px-3 py-1.5 rounded-lg bg-red-950 text-red-300 border border-red-800 font-mono text-[11px] font-bold">
                              🚫 Cancelled ({order.cancellationReason || 'Cancelled'})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Customer Delivery Address */}
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="font-bold text-white flex items-center justify-between font-mono text-[11px] text-pink-400">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Customer Delivery Address</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const it = order.items[0];
                                const formattedAddress = `Name: ${order.customer.fullName}\nPhone: ${order.customer.phone}\nAddress: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}\nItem: ${it?.productTitle}\nSize: ${it?.selectedSize || 'Free'}\nQty: ${it?.quantity || 1}`;
                                navigator.clipboard.writeText(formattedAddress);
                                setCopiedOrderNotice(`📋 Address copied for ${order.customer.fullName}!`);
                                setTimeout(() => setCopiedOrderNotice(null), 3500);
                              }}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1"
                            >
                              <Clipboard className="w-3 h-3 text-pink-400" />
                              <span>Copy Address</span>
                            </button>
                          </div>
                          <div className="space-y-1 text-slate-300 leading-relaxed">
                            <div className="font-bold text-white">{order.customer.fullName}</div>
                            <div>{order.customer.address}</div>
                            <div>{order.customer.city}, {order.customer.state} - <strong className="font-mono text-white">{order.customer.pincode}</strong></div>
                            <div className="pt-1 font-mono text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-pink-400" />
                              <span>{order.customer.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Supplier Fulfillment & Tracking */}
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px] text-cyan-400">
                            <Bot className="w-3.5 h-3.5" />
                            <span>Automated Supplier Gateway Status</span>
                          </div>
                          <div className="space-y-1.5 font-mono text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Supplier:</span>
                              <strong className="text-white">Meesho Direct Wholesale</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Meesho Order Ref:</span>
                              <strong className="text-cyan-300">{order.fulfillmentDetails?.meeshoOrderNumber || 'MEESHO-DISP-48901'}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Tracking AWB:</span>
                              <strong className="text-emerald-400">{order.meeshoAwbNumber || order.fulfillmentDetails?.trackingId || 'In Queue'}</strong>
                            </div>
                            <div className="pt-2 space-y-2">
                              <button
                                type="button"
                                onClick={() => handleOpenAndCopyMeeshoOrder(order)}
                                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>🛒 Open Product & Place Order on Meesho</span>
                              </button>

                              <button
                                onClick={() => onRetryForward(order.id)}
                                className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Sync / Re-Forward Order</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items Table */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">Ordered Product Items:</div>
                        {order.items.map((it, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img src={it.image} alt={it.productTitle} className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0" />
                              <div>
                                <div className="font-bold text-white">{it.productTitle}</div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  Size: {it.selectedSize} • Color: {it.selectedColor} • Qty: {it.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="text-right font-mono text-xs">
                              <div className="font-bold text-white">₹{it.retailPrice * it.quantity}</div>
                              <div className="text-[10px] text-slate-500">Supplier: ₹{it.supplierPrice * it.quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Automation Log Stream */}
                      {order.fulfillmentDetails?.automationLogs && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                          <div className="text-slate-400 font-bold flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Supplier Automation & Escrow Logs:</span>
                          </div>
                          <div className="space-y-1 text-slate-300 text-[10px] leading-tight max-h-32 overflow-y-auto pr-1">
                            {order.fulfillmentDetails.automationLogs.map((log, i) => (
                              <div key={i} className="text-slate-400">
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersFulfillmentTable;
