import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  MapPin, 
  CheckCircle, 
  CircleDashed, 
  Clock, 
  Package, 
  Calendar, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  ArrowRight,
  XCircle,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { CustomerOrder, MeeshoShippingStage } from '../types/dropship';

interface BuyerOrderTrackerProps {
  initialOrder?: CustomerOrder | null;
  onOrderUpdated?: (order: CustomerOrder) => void;
}

export const BuyerOrderTracker: React.FC<BuyerOrderTrackerProps> = ({ initialOrder, onOrderUpdated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<CustomerOrder | null>(initialOrder || null);
  const [myOrdersList, setMyOrdersList] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cancellation Modal state
  const [cancellingOrder, setCancellingOrder] = useState<CustomerOrder | null>(null);
  const [cancelReason, setCancelReason] = useState('Placed order by mistake');
  const [customCancelText, setCustomCancelText] = useState('');
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [cancelSuccessNotice, setCancelSuccessNotice] = useState<string | null>(null);

  // Sync when initialOrder prop changes
  useEffect(() => {
    if (initialOrder) {
      setTrackedOrder(initialOrder);
      setMyOrdersList(prev => {
        const exists = prev.some(o => o.id === initialOrder.id);
        const next = exists ? prev.map(o => o.id === initialOrder.id ? initialOrder : o) : [initialOrder, ...prev];
        try { localStorage.setItem('dropship_my_orders', JSON.stringify(next)); } catch (e) {}
        return next;
      });
    }
  }, [initialOrder]);

  // Load recently placed orders from LocalStorage + Server
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dropship_my_orders');
      if (saved) {
        const parsed: CustomerOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMyOrdersList(parsed);
          if (!trackedOrder) {
            setTrackedOrder(parsed[0]);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleTrack = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || searchQuery;
    if (!queryToUse.trim()) {
      setErrorMsg("Kripya apna Order Number (e.g. ORD-10001) ya Mobile Number dalein.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setCancelSuccessNotice(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(queryToUse.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order nahi mila. Kripya check karein.");
      }
      setTrackedOrder(data.order);
      // Sync into my orders list
      setMyOrdersList(prev => {
        const exists = prev.some(o => o.id === data.order.id);
        const next = exists ? prev.map(o => o.id === data.order.id ? data.order : o) : [data.order, ...prev];
        try { localStorage.setItem('dropship_my_orders', JSON.stringify(next)); } catch (e) {}
        return next;
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Order tracking details fetch karne me dikkat aayi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;

    setIsCancelLoading(true);
    setErrorMsg(null);

    const fullReason = cancelReason === 'Other' ? (customCancelText || 'Customer requested cancellation') : cancelReason;

    try {
      const res = await fetch(`/api/orders/${cancellingOrder.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: fullReason,
          cancelledBy: 'BUYER'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order cancel nahi ho paya.");
      }

      const updatedOrder = data.order;
      setTrackedOrder(updatedOrder);

      // Update in My Orders list & localStorage
      setMyOrdersList(prev => {
        const next = prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
        try { localStorage.setItem('dropship_my_orders', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      if (onOrderUpdated) onOrderUpdated(updatedOrder);

      setCancelSuccessNotice(`Order ${updatedOrder.orderNumber} successfully cancel ho gaya hai!`);
      setCancellingOrder(null);
      setCustomCancelText('');
    } catch (err: any) {
      setErrorMsg(err.message || "Cancellation failed");
    } finally {
      setIsCancelLoading(false);
    }
  };

  const getStageIndex = (stage?: MeeshoShippingStage) => {
    switch (stage) {
      case 'ORDER_CONFIRMED': return 0;
      case 'SHIPPED_FROM_MEESHO': return 1;
      case 'IN_TRANSIT': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const stagesList = [
    { title: "Order Confirmed", desc: "Supplier verified product stock" },
    { title: "Shipped from Hub", desc: "Handed over to courier facility" },
    { title: "In Transit", desc: "Moving towards destination city" },
    { title: "Out for Delivery", desc: "Delivery agent on the way" },
    { title: "Delivered", desc: "Safely received at address" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Package className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
              <span>My Orders & Live Meesho Tracking</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                ग्राहक पोर्टल
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Apne placed orders dekhein, live Delhivery courier track karein ya order cancel karein
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1.5 shadow">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live Courier GPS Active</span>
        </span>
      </div>

      {/* Search Input Box */}
      <form onSubmit={(e) => handleTrack(e)} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Order Number (e.g. ORD-10001) or 10-digit Mobile Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white text-xs sm:text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-pink-500 shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-xl shadow-pink-500/20 disabled:opacity-50 transition-all"
        >
          <span>{isLoading ? 'Checking...' : 'SEARCH & TRACK'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Success Cancellation Notice */}
      {cancelSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1 font-bold">{cancelSuccessNotice}</div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-fade-in font-sans">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Recent Orders Quick Switcher Pill List */}
      {myOrdersList.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
            <span>Your Recent Orders ({myOrdersList.length}):</span>
            <span className="text-[11px] text-slate-500">Click any order to view details & tracking</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myOrdersList.map((ord) => {
              const isSelected = trackedOrder?.id === ord.id;
              const isCancelled = ord.isCancelled || ord.shippingStage === 'CANCELLED';

              return (
                <div
                  key={ord.id}
                  onClick={() => setTrackedOrder(ord)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-950 border-pink-500/80 shadow-lg shadow-pink-500/10 scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={ord.items[0]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                      alt="Item"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono font-bold text-xs text-white truncate">{ord.orderNumber}</span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isCancelled
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : ord.shippingStage === 'DELIVERED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}>
                          {isCancelled ? 'CANCELLED' : ord.shippingStage?.replace(/_/g, ' ') || 'CONFIRMED'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 truncate font-medium">
                        {ord.items[0]?.productTitle}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                        <span className="text-emerald-400 font-bold">₹{ord.totalRetailAmount}</span>
                        <span>{ord.paymentMethod === 'ONLINE_UPI' ? 'Paid (UPI)' : 'Cash on Delivery'}</span>
                      </div>

                      {/* Quick Cancel button for pending/active orders */}
                      {!isCancelled && ord.shippingStage !== 'DELIVERED' && (
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCancellingOrder(ord);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white text-[10px] font-mono font-bold flex items-center gap-1 border border-red-800/60 transition-colors"
                          >
                            <XCircle className="w-3 h-3 text-red-400" />
                            <span>Cancel Order</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TRACKED ORDER FULL DETAILS & LIVE PROGRESS */}
      {trackedOrder && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-purple-500/30 space-y-6 animate-fade-in text-xs">
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-base sm:text-lg text-white font-mono">{trackedOrder.orderNumber}</span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                  trackedOrder.isCancelled || trackedOrder.shippingStage === 'CANCELLED'
                    ? 'bg-red-950 text-red-300 border border-red-700'
                    : 'bg-purple-950 text-purple-300 border border-purple-800'
                }`}>
                  {trackedOrder.isCancelled || trackedOrder.shippingStage === 'CANCELLED'
                    ? '🚫 ORDER CANCELLED'
                    : `AWB: ${trackedOrder.meeshoAwbNumber || 'DLVRY-IND-99401'}`}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {trackedOrder.courierPartner || 'Delhivery Express'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 font-mono">
                Order Placed On: <strong>{new Date(trackedOrder.createdAt).toLocaleString()}</strong> • Recipient: <strong>{trackedOrder.customer.fullName}</strong>
              </div>
            </div>

            {/* Action Bar (Cancel Button or Delivery Date) */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Cancel Button if not already cancelled or delivered */}
              {!trackedOrder.isCancelled && trackedOrder.shippingStage !== 'CANCELLED' && trackedOrder.shippingStage !== 'DELIVERED' && (
                <button
                  type="button"
                  onClick={() => setCancellingOrder(trackedOrder)}
                  className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Cancel Order (ऑर्डर रद्द करें)</span>
                </button>
              )}

              <div className="text-right font-mono pl-2 border-l border-slate-800">
                <div className="text-[10px] text-slate-400">Estimated Delivery:</div>
                <div className="text-xs font-black text-emerald-400">
                  {trackedOrder.isCancelled ? 'N/A (Cancelled)' : (trackedOrder.estimatedDeliveryDate || 'Within 3-4 Days')}
                </div>
              </div>
            </div>
          </div>

          {/* If Cancelled Banner */}
          {(trackedOrder.isCancelled || trackedOrder.shippingStage === 'CANCELLED') && (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 space-y-1">
              <div className="flex items-center gap-2 text-red-300 font-bold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>This Order Was Cancelled</span>
              </div>
              <div className="text-xs text-red-200">
                <strong>Cancellation Reason:</strong> {trackedOrder.cancellationReason || "Customer requested cancellation."}
              </div>
              <div className="text-[11px] text-red-300/80 font-mono pt-1">
                {trackedOrder.paymentMethod === 'ONLINE_UPI'
                  ? '✅ 100% Online UPI Refund has been initiated back to your bank account.'
                  : '✅ Cash on Delivery (COD) dispatch has been halted. No payment is required.'}
              </div>
            </div>
          )}

          {/* Stepper Progress Bar (If active) */}
          {!trackedOrder.isCancelled && trackedOrder.shippingStage !== 'CANCELLED' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Current Courier Stage:</span>
                <span className="text-pink-400 font-bold uppercase">
                  {trackedOrder.shippingStage?.replace(/_/g, ' ') || 'ORDER CONFIRMED'}
                </span>
              </div>

              {/* Stepper Grid */}
              <div className="grid grid-cols-5 gap-2">
                {stagesList.map((step, idx) => {
                  const currentIdx = getStageIndex(trackedOrder.shippingStage);
                  const isPassed = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={idx} className="space-y-1.5 text-center">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCurrent
                            ? 'bg-pink-500 shadow-lg shadow-pink-500/50 animate-pulse'
                            : isPassed
                            ? 'bg-emerald-400'
                            : 'bg-slate-800'
                        }`}
                      />
                      <div className="font-mono text-[9px] sm:text-[10px] font-bold line-clamp-1 text-slate-300">
                        {step.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items & Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Ordered Items List */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs font-mono text-pink-400">
                <Package className="w-4 h-4" />
                <span>Ordered Items ({trackedOrder.items.length})</span>
              </div>

              <div className="space-y-2.5">
                {trackedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <img src={it.image} alt={it.productTitle} className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{it.productTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Size: <strong>{it.selectedSize || 'Free'}</strong> • Color: <strong>{it.selectedColor || 'Standard'}</strong> • Qty: {it.quantity || 1}
                      </div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        ₹{it.retailPrice * (it.quantity || 1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-mono text-xs">
                <span className="text-slate-400">Total Amount:</span>
                <span className="text-emerald-400 font-black text-sm">₹{trackedOrder.totalRetailAmount}</span>
              </div>
            </div>

            {/* Delivery Address & Protection */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Delivery Address & Protection</span>
              </div>

              <div className="space-y-1.5 text-slate-300 text-xs">
                <div><strong>Recipient:</strong> {trackedOrder.customer.fullName}</div>
                <div><strong>Phone:</strong> {trackedOrder.customer.phone}</div>
                <div><strong>Address:</strong> {trackedOrder.customer.address}, {trackedOrder.customer.city} - {trackedOrder.customer.pincode}</div>
                <div><strong>Payment:</strong> <span className="font-mono text-pink-400 font-bold">{trackedOrder.paymentMethod === 'ONLINE_UPI' ? 'Paid via UPI QR' : 'Cash on Delivery (COD)'}</span></div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 space-y-0.5 mt-2">
                  <div className="font-bold">🛡️ Meesho Buyer Protection Guarantee</div>
                  <div className="text-slate-400">7-Day Hassle-Free Returns & 100% doorstep quality check.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Checkpoint Milestones */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="font-bold text-white flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <MapPin className="w-4 h-4" />
              <span>Live Checkpoint Tracking Timeline</span>
            </div>

            <div className="space-y-2 pt-1">
              {(trackedOrder.trackingHistory && trackedOrder.trackingHistory.length > 0
                ? trackedOrder.trackingHistory
                : [
                    {
                      title: "Order Placed & Confirmed",
                      description: "Supplier verified product inventory and packaged items.",
                      timestamp: new Date().toLocaleTimeString(),
                      location: "Supplier Center",
                      isCompleted: true
                    }
                  ]
              ).map((check, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  {check.title.includes('Cancelled') ? (
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{check.title}</div>
                    <div className="text-[11px] text-slate-400">{check.description}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {check.timestamp} • {check.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CANCEL ORDER MODAL */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up font-sans text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-950 text-red-400 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Cancel Order ({cancellingOrder.orderNumber})</h3>
                  <p className="text-xs text-slate-400">Kya aap is order ko sach me cancel karna chahte hain?</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Select Reason for Cancellation (कैंसिल करने का कारण चुनें):
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                >
                  <option value="Placed order by mistake (गलती से ऑर्डर हो गया)">Placed order by mistake (गलती से ऑर्डर हो गया)</option>
                  <option value="Want to change address or phone number (पता या फोन बदलना है)">Want to change address or phone number (पता या फोन बदलना है)</option>
                  <option value="Want to change size or color (साइज या कलर बदलना है)">Want to change size or color (साइज या कलर बदलना है)</option>
                  <option value="Delivery time is too long (डिलीवरी टाइम ज्यादा है)">Delivery time is too long (डिलीवरी टाइम ज्यादा है)</option>
                  <option value="Found a better price elsewhere (कहीं और सस्ता मिल गया)">Found a better price elsewhere (कहीं और सस्ता मिल गया)</option>
                  <option value="Other">Other (अन्य कारण)</option>
                </select>
              </div>

              {cancelReason === 'Other' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Explain Reason:</label>
                  <textarea
                    rows={2}
                    placeholder="Apna reason likhein..."
                    value={customCancelText}
                    onChange={(e) => setCustomCancelText(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div>• <strong>Payment Mode:</strong> {cancellingOrder.paymentMethod === 'ONLINE_UPI' ? 'Paid via UPI' : 'Cash on Delivery (COD)'}</div>
                <div>• {cancellingOrder.paymentMethod === 'ONLINE_UPI' ? 'Cancel hone par ₹' + cancellingOrder.totalRetailAmount + ' refund aapke bank me bhej diya jayega.' : 'COD order turant cancel ho jayega aur koi payment nahi deni hogi.'}</div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs font-mono"
                >
                  DON'T CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isCancelLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isCancelLoading ? 'Cancelling...' : 'CONFIRM CANCEL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrderTracker;

