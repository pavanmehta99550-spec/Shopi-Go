import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  QrCode,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Lock,
  AlertTriangle,
  PackageX
} from 'lucide-react';
import { DropshipProduct, CustomerOrder } from '../types/dropship';

interface CustomerCheckoutModalProps {
  product: DropshipProduct;
  onClose: () => void;
  onOrderSuccess: (order: CustomerOrder) => void;
}

export const CustomerCheckoutModal: React.FC<CustomerCheckoutModalProps> = ({
  product,
  onClose,
  onOrderSuccess
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);

  // Check Meesho Live COD availability for this specific product
  const isMeeshoCodEnabled = product.meeshoCodAvailable !== false;
  const isProductInStock = product.inStock !== false && (product.stockCount === undefined || product.stockCount > 0);

  // Customer Form Details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi NCR');
  const [pincode, setPincode] = useState('');
  
  // If Meesho doesn't offer COD for this product, automatically default to ONLINE_UPI
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE_UPI'>(
    isMeeshoCodEnabled ? 'COD' : 'ONLINE_UPI'
  );

  // Supplier Merchant Details fetched from server for QR generation
  const [merchantUpi, setMerchantUpi] = useState('pavan99550@okaxis');
  const [merchantName, setMerchantName] = useState('Pavan Enterprises');
  const [userEnteredUpiRef, setUserEnteredUpiRef] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [cancellationNotice, setCancellationNotice] = useState<string | null>(null);

  const totalRetail = product.retailPrice * quantity;

  // Fetch linked supplier UPI details from backend
  useEffect(() => {
    fetch('/api/payments/merchant-upi')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.upiId) setMerchantUpi(data.upiId);
          if (data.merchantName) setMerchantName(data.merchantName);
        }
      })
      .catch(err => console.warn("Could not fetch merchant UPI:", err));
  }, []);

  // Generate standardized Indian UPI deep link with exact amount
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=${encodeURIComponent(merchantName)}&am=${totalRetail}&cu=INR&tn=${encodeURIComponent(`Order for ${product.catchyTitle.substring(0, 30)}`)}`;

  // High resolution QR code URL encoded with exact amount
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProductInStock) {
      setErrorMsg("Yeh product supplier ke paas abhi Out of Stock hai!");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      setErrorMsg("Kripya apna Naam, Mobile Number, Pura Address aur Pincode bharein!");
      return;
    }

    if (paymentMethod === 'COD' && !isMeeshoCodEnabled) {
      setErrorMsg("Is product par Meesho supplier COD provide nahi karta. Kripya UPI QR se payment karein.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: address.trim(),
          city: city.trim() || "Local",
          state: state,
          pincode: pincode.trim()
        },
        items: [
          {
            productId: product.id,
            productTitle: product.catchyTitle || product.title,
            supplierSource: product.sourceSupplier,
            sourceUrl: product.sourceUrl || "https://www.meesho.com",
            supplierPrice: product.supplierPrice,
            retailPrice: product.retailPrice,
            selectedSize,
            selectedColor,
            quantity,
            image: product.images[0]
          }
        ],
        paymentMethod,
        transactionId: paymentMethod === 'ONLINE_UPI' ? (userEnteredUpiRef.trim() || `UPI-TXN-${Date.now().toString().slice(-6)}`) : undefined
      };

      const res = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order place karne me dikkat aayi");
      }

      const order: CustomerOrder = data.order;
      setConfirmedOrder(order);

      // Save to My Orders in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('dropship_my_orders') || '[]');
        const updated = [order, ...existing.filter((o: any) => o.id !== order.id)];
        localStorage.setItem('dropship_my_orders', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      onOrderSuccess(order);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit customer order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickCancel = async () => {
    if (!confirmedOrder) return;
    setIsCancellingOrder(true);

    try {
      const res = await fetch(`/api/orders/${confirmedOrder.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: "Placed by mistake (Cancelled right after checkout)", cancelledBy: "BUYER" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedOrder(data.order);
        setCancellationNotice(`Order ${confirmedOrder.orderNumber} cancel ho gaya hai!`);
        // Update in localStorage
        try {
          const existing = JSON.parse(localStorage.getItem('dropship_my_orders') || '[]');
          const updated = existing.map((o: any) => o.id === data.order.id ? data.order : o);
          localStorage.setItem('dropship_my_orders', JSON.stringify(updated));
        } catch (e) {}
      }
    } catch (err: any) {
      setErrorMsg("Order cancel nahi ho paya: " + err.message);
    } finally {
      setIsCancellingOrder(false);
    }
  };

  // If order was confirmed, show the celebration & tracking screen
  if (confirmedOrder) {
    const isCancelled = confirmedOrder.isCancelled || confirmedOrder.shippingStage === 'CANCELLED';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100 animate-scale-up">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-white">
              {isCancelled ? 'Order Cancelled' : '🎉 Order Confirmed & Placed!'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Order Number: <strong className="text-pink-400 font-black text-sm">{confirmedOrder.orderNumber}</strong>
            </p>
          </div>

          {cancellationNotice && (
            <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs text-center font-bold">
              {cancellationNotice}
            </div>
          )}

          {/* Order Snapshot */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <img src={confirmedOrder.items[0]?.image} alt="Item" className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0" />
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="font-bold text-white truncate">{confirmedOrder.items[0]?.productTitle}</div>
                <div className="text-[11px] text-slate-400 font-mono">Qty: {quantity} • Size: {selectedSize} • Color: {selectedColor}</div>
                <div className="text-xs font-bold text-emerald-400 font-mono">Total Paid: ₹{confirmedOrder.totalRetailAmount} ({confirmedOrder.paymentMethod === 'ONLINE_UPI' ? 'Paid via UPI' : 'Cash on Delivery'})</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div><strong>Deliver To:</strong> {confirmedOrder.customer.fullName} ({confirmedOrder.customer.phone})</div>
              <div className="truncate"><strong>Address:</strong> {confirmedOrder.customer.address}, {confirmedOrder.customer.city} - {confirmedOrder.customer.pincode}</div>
              <div className="text-pink-400 font-mono font-bold">
                Status: {isCancelled ? '🚫 CANCELLED' : '🚚 ORDER CONFIRMED (Estimated Delivery in 3-4 Days)'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                setTimeout(() => {
                  document.getElementById('buyer-orders-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
            >
              <span>📦 VIEW IN MY ORDERS & TRACK ORDER</span>
            </button>

            {!isCancelled && (
              <button
                type="button"
                disabled={isCancellingOrder}
                onClick={handleQuickCancel}
                className="w-full py-2.5 px-4 rounded-2xl bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300 hover:text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isCancellingOrder ? 'Cancelling...' : '🚫 CANCEL THIS ORDER (गलती से आर्डर हुआ)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header - Authentic Customer Look (No internal supplier profit leak!) */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Complete Your Order
              </h3>
              <p className="text-[11px] text-slate-400">
                {isMeeshoCodEnabled ? 'Cash on Delivery Available • ' : 'Prepaid Item • '}
                Instant UPI QR • 7-Day Returns
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Out of Stock Warning if applicable */}
          {!isProductInStock && (
            <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
              <PackageX className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <strong>Currently Out of Stock on Meesho:</strong> Supplier warehouse stock khatam ho gaya hai. Auto-sync ne naye orders pause kar diye hain.
              </div>
            </div>
          )}

          {/* Selected Product Summary (Standard Buyer View) */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <img
              src={product.images[0]}
              alt={product.catchyTitle}
              className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
            />
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-xs text-white line-clamp-1">
                {product.catchyTitle}
              </h4>
              <div className="text-xs text-slate-300 font-mono flex items-center gap-2">
                <span className="font-black text-pink-400 text-sm">₹{product.retailPrice}</span>
                <span className="text-[11px] text-slate-500 line-through">₹{product.compareAtPrice}</span>
                <span className="text-[10px] text-emerald-400 font-bold">Free Delivery</span>
              </div>

              {/* Stock Indicator */}
              <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono">
                {isProductInStock ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>In Stock ({product.stockCount || 'Available'} units)</span>
                  </span>
                ) : (
                  <span className="text-red-400 font-bold">Sold Out / Out of Stock</span>
                )}
                <span className="text-slate-500">•</span>
                <span className={isMeeshoCodEnabled ? "text-cyan-300" : "text-amber-400"}>
                  {isMeeshoCodEnabled ? "Meesho COD Eligible" : "Meesho Prepaid Only"}
                </span>
              </div>

              {/* Variants Selector */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                {product.sizes.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Size:</span>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-0.5 text-xs font-mono"
                    >
                      {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                {product.colors.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Color:</span>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-0.5 text-xs font-mono"
                    >
                      {product.colors.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">Qty:</span>
                  <input
                    type="number"
                    min="1"
                    max={product.stockCount || 10}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 bg-slate-900 border border-slate-700 text-white rounded px-1.5 py-0.5 text-xs font-mono text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Address Form */}
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
            <h5 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              <span>Delivery Address (डिलीवरी पता)</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300">House No., Building, Street Name, Area *</label>
              <textarea
                required
                rows={2}
                placeholder="e.g. House No. 42, Gali No. 3, Near Shiv Temple, Sector 18"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">City / District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">State *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 302001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>
            </div>

            {/* DYNAMIC PAYMENT METHOD SELECTOR (Conditioned on Meesho COD Availability) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-slate-300 font-bold">Select Payment Mode</label>
                {!isMeeshoCodEnabled && (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    ⚠️ Meesho par is product par COD band hai (Prepaid only)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Cash on Delivery Button - Only available if Meesho has COD! */}
                {isMeeshoCodEnabled ? (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      paymentMethod === 'COD'
                        ? 'bg-pink-950/40 border-pink-500 ring-2 ring-pink-500/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-white">Cash on Delivery (COD)</div>
                      <div className="text-[10px] text-slate-400">Pay cash upon home delivery</div>
                    </div>
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl border border-slate-800 bg-slate-950/50 opacity-60 cursor-not-allowed text-left flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-slate-500">COD Not Available</div>
                      <div className="text-[10px] text-slate-600">Supplier offers prepaid only</div>
                    </div>
                  </div>
                )}

                {/* Instant Dynamic UPI QR Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ONLINE_UPI')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                    paymentMethod === 'ONLINE_UPI'
                      ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-400/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-white">Scan & Pay UPI QR</div>
                    <div className="text-[10px] text-purple-300 font-medium">Auto-QR for ₹{totalRetail}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* DYNAMIC UPI QR CODE SECTION (Generated for exact amount of this product) */}
            {paymentMethod === 'ONLINE_UPI' && (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-950 border border-purple-500/40 space-y-3.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                      ⚡
                    </span>
                    <div>
                      <div className="font-bold text-white text-xs">
                        Scan with any UPI App to Pay ₹{totalRetail}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Official Escrow: <strong>{merchantName}</strong> • <span className="text-emerald-400 font-bold">100% Safe (7-Day Return Guarantee)</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    AMOUNT: ₹{totalRetail}
                  </span>
                </div>

                {/* QR Code and Instructions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                  <div className="p-2.5 bg-white rounded-xl shadow-lg shrink-0 border-2 border-purple-400/30">
                    <img
                      src={upiQrCodeUrl}
                      alt={`UPI QR Code for INR ${totalRetail}`}
                      className="w-36 h-36 object-contain"
                    />
                    <div className="text-[10px] font-black text-slate-950 text-center font-mono pt-1">
                      ₹{totalRetail}.00
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-left w-full">
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-white">Direct UPI ID:</div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-purple-300 text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-purple-800/80 truncate">
                          {merchantUpi}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpiId}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-mono flex items-center gap-1 shrink-0"
                        >
                          {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-tight">
                      Open <strong>Google Pay, PhonePe, Paytm ya BHIM</strong>, scan QR code. Amount <strong>₹{totalRetail}</strong> automatically fill ho jayega.
                    </p>

                    {/* Direct mobile deep link button (Works directly on mobile phones!) */}
                    <a
                      href={upiDeepLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] font-mono shadow-md"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Click to Pay via Mobile App (GPay/PhonePe)</span>
                    </a>
                  </div>
                </div>

                {/* Optional UTR / Reference Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>UPI Reference Number / UTR / Order Note (Optional):</span>
                    <span className="text-emerald-400">Instant Verification</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12-digit UTR from payment screen (or leave blank)"
                    value={userEnteredUpiRef}
                    onChange={(e) => setUserEnteredUpiRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            )}

            {/* Trust note */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Safe & Secure Delivery • Direct Bank Settlement • 7 Days Returns</span>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </form>
        </div>

        {/* Footer for Buyer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 w-full sm:w-auto">
            <div className="text-[11px] text-slate-400 font-mono">Total Payable Amount:</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono">₹{totalRetail}</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                (Free Delivery Included)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>

            <button
              form="checkout-form"
              type="submit"
              disabled={isSubmitting || !isProductInStock}
              className="flex-1 sm:flex-initial py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm font-sans flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Confirming Order...</span>
                </>
              ) : !isProductInStock ? (
                <>
                  <PackageX className="w-4 h-4 text-slate-950" />
                  <span>OUT OF STOCK</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>
                    {paymentMethod === 'ONLINE_UPI' ? `PAID VIA UPI & PLACE ORDER` : 'PLACE ORDER NOW (COD)'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCheckoutModal;
