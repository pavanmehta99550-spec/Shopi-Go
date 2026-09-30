import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Save, 
  AlertCircle,
  Copy,
  Check,
  Landmark,
  ArrowRight,
  TrendingUp,
  Lock,
  Percent,
  Coins,
  Hourglass,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { PlatformOwnerAccount, SupplierBankAccount } from '../types/dropship';

export const SupplierBankSettings: React.FC = () => {
  // 1. Platform Owner (You / Pavan Mehta) Account State
  const [ownerAccount, setOwnerAccount] = useState<PlatformOwnerAccount>({
    ownerName: "Pavan Mehta (Platform Creator)",
    businessName: "Meesho Multi-Seller Escrow Gateway",
    ownerUpiId: "pavanmehta99550@okaxis",
    bankName: "State Bank of India (SBI)",
    accountNumber: "389201948210",
    ifscCode: "SBIN0001245",
    platformFeePercent: 7.5,
    totalAdminEarnings: 33.68,
    totalFundsHeldInEscrow: 449.00
  });

  // 2. Seller Payout Account State
  const [sellerBank, setSellerBank] = useState<SupplierBankAccount>({
    sellerId: "seller_default_1",
    accountHolderName: "Kolkata Apparel Mill",
    bankName: "HDFC Bank Ltd",
    accountNumber: "50200039281920",
    ifscCode: "HDFC0001024",
    upiId: "supplier.kolkata@okhdfcbank",
    accountType: "CURRENT",
    pendingSettlementAmount: 215.32,
    totalPaidOutAmount: 0,
    isVerified: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load existing data
  const fetchData = async () => {
    try {
      const [adminRes, sellerRes] = await Promise.all([
        fetch('/api/admin/escrow-account'),
        fetch('/api/supplier/bank-account')
      ]);

      if (adminRes.ok) {
        const aData = await adminRes.json();
        if (aData.ownerAccount) setOwnerAccount(aData.ownerAccount);
      }

      if (sellerRes.ok) {
        const sData = await sellerRes.json();
        if (sData.bankAccount) setSellerBank(sData.bankAccount);
      }
    } catch (e) {
      console.warn("Failed to load accounts:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Platform Owner (Pavan) Account Details
  const handleSaveOwnerAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/escrow-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ownerAccount)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setOwnerAccount(data.ownerAccount);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update escrow account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(ownerAccount.ownerUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const sampleAmount = 499;
  const sampleUpiUrl = `upi://pay?pa=${encodeURIComponent(ownerAccount.ownerUpiId)}&pn=${encodeURIComponent(ownerAccount.businessName)}&am=${sampleAmount}&cu=INR&tn=Buyer%20Payment%20to%20Admin%20Escrow`;
  const sampleQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(sampleUpiUrl)}`;

  return (
    <div className="space-y-6 font-sans">
      {/* Platform Owner Hero Escrow Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-950 to-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Landmark className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  MEESHO ESCROW ARCHITECTURE ACTIVE
                </span>
                <span className="text-[11px] text-purple-300 font-mono">Rule: 100% Buyer Funds Hit Admin First</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Admin Escrow & Seller 7-Day Settlement System
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Aapne yeh platform banaya hai, isliye <strong>har seller ke orders ka paisa sabse pehle aapke (Owner) account me aayega</strong>. 
                Aapka platform commission auto-cut hoga, aur bacha hua supplier payout <strong>7-Day Return Window pass hone ke baad hi</strong> seller ko jayega. Agar product return hota hai, toh refund buyer ko hoga aur supplier ko ₹0 jayega!
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-right">
              <div className="text-[10px] text-slate-400 font-mono">Admin Platform Cut</div>
              <div className="text-base font-black text-amber-400 font-mono">+{ownerAccount.platformFeePercent}% / Order</div>
              <div className="text-[10px] text-emerald-400 font-mono">₹{ownerAccount.totalAdminEarnings} Earned</div>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-right">
              <div className="text-[10px] text-slate-400 font-mono">Held in Escrow</div>
              <div className="text-base font-black text-cyan-400 font-mono">₹{ownerAccount.totalFundsHeldInEscrow}</div>
              <div className="text-[10px] text-slate-400 font-mono">Awaiting 7-Day Return</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SECTION 1: PLATFORM OWNER (YOU) ACCOUNT SETTINGS */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveOwnerAccount} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white font-mono uppercase">
                  1. Aapka (Platform Owner) Bank & Escrow Account
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-700 px-2 py-0.5 rounded">
                All Buyer QR Scans Land Here
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 font-bold">Platform Creator / Owner Name *</label>
                <input
                  type="text"
                  required
                  value={ownerAccount.ownerName}
                  onChange={(e) => setOwnerAccount({ ...ownerAccount, ownerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 font-bold">Business Name (Visible to Buyer) *</label>
                <input
                  type="text"
                  required
                  value={ownerAccount.businessName}
                  onChange={(e) => setOwnerAccount({ ...ownerAccount, businessName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Owner UPI ID */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-amber-400 font-bold flex items-center justify-between">
                <span>Owner Primary UPI ID (Customer Checkout Payment Target) *</span>
                <span className="text-[10px] text-slate-400">Paisa direct is UPI par aayega</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={ownerAccount.ownerUpiId}
                  onChange={(e) => setOwnerAccount({ ...ownerAccount, ownerUpiId: e.target.value })}
                  className="w-full pl-3.5 pr-20 py-2.5 bg-slate-950 border-2 border-amber-500/50 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-mono flex items-center gap-1"
                >
                  {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Bank details & Platform Fee Cut */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Owner Bank Name</label>
                <input
                  type="text"
                  value={ownerAccount.bankName}
                  onChange={(e) => setOwnerAccount({ ...ownerAccount, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Account Number</label>
                <input
                  type="text"
                  value={ownerAccount.accountNumber}
                  onChange={(e) => setOwnerAccount({ ...ownerAccount, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-amber-400 font-bold">Platform Fee Cut (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="30"
                    value={ownerAccount.platformFeePercent}
                    onChange={(e) => setOwnerAccount({ ...ownerAccount, platformFeePercent: parseFloat(e.target.value) || 5 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-amber-500/50 rounded-xl text-white font-mono text-xs font-bold"
                  />
                  <Percent className="w-3 h-3 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Owner Escrow settings updated! Sabhi payments aapke is account me redirect honge.</span>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs font-sans flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>UPDATE ADMIN ESCROW SETTINGS</span>
              </button>
            </div>
          </form>

          {/* SECTION 2: SELLER PAYOUT STATUS (AFTER 7-DAY RETURN WINDOW) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Hourglass className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white font-mono uppercase">
                  2. Seller / Supplier Payout Dashboard (7-Day Post Return)
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                Delayed Settlement
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-mono text-slate-400">Supplier Name:</div>
                  <div className="font-bold text-white text-xs">{sellerBank.accountHolderName}</div>
                  <div className="text-[11px] font-mono text-purple-300">{sellerBank.upiId}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400">Bank & IFSC:</div>
                  <div className="font-bold text-white text-xs">{sellerBank.bankName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{sellerBank.ifscCode}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                  <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                    <Hourglass className="w-3 h-3 text-amber-400" />
                    <span>Held in Return Escrow:</span>
                  </div>
                  <div className="text-base font-black text-white font-mono mt-0.5">
                    ₹{sellerBank.pendingSettlementAmount}
                  </div>
                  <div className="text-[9px] text-slate-400">Will release after 7 days if no return</div>
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                  <div className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Total Settled to Seller:</span>
                  </div>
                  <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                    ₹{sellerBank.totalPaidOutAmount}
                  </div>
                  <div className="text-[9px] text-slate-400">Released after return window expired</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: LIVE ESCROW WORKFLOW EXPLANATION & QR CARD */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-purple-500/40 shadow-2xl space-y-4 text-center text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Buyer Payment Destination</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-950 px-2 py-0.5 rounded border border-amber-800 font-bold">
                Hits Your Account
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed text-left">
              Customer checkout par banne wala QR code <strong>direct aapke (Owner) UPI ID</strong> se bana hota hai:
            </p>

            {/* Generated QR Code Card */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-xl border-4 border-amber-400/40">
              <img
                src={sampleQrUrl}
                alt="Dynamic UPI QR Code Preview"
                className="w-36 h-36 object-contain mx-auto"
              />
              <div className="text-[11px] font-black text-slate-900 pt-1 font-mono">
                PAYS TO: {ownerAccount.businessName}
              </div>
            </div>

            <div className="space-y-1 text-xs text-left">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Account Holder:</span>
                <span className="text-amber-300">{ownerAccount.ownerName}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-400">Escrow UPI:</span>
                <span className="text-purple-300">{ownerAccount.ownerUpiId}</span>
              </div>
            </div>

            {/* Meesho-like 7-Day Protection Flow */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-left font-mono text-[10px]">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                <span>Meesho Settlement Lifecycle:</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">1.</span>
                  <span>Customer pays ₹449 &rarr; 100% enters <strong>Aapke Account me</strong>.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">2.</span>
                  <span>Aapka Commission ({ownerAccount.platformFeePercent}%) deduct ho jata hai.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">3.</span>
                  <span>Order deliver hone ke baad <strong>7 Days Return Window</strong> shuru hoti hai.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">4.</span>
                  <span>Agar customer return nahi karta &rarr; 7th day ke baad supplier ko settlement release hoti hai!</span>
                </div>
                <div className="flex items-start gap-1.5 text-red-300">
                  <span className="text-red-400 font-bold">5.</span>
                  <span>Agar return ho gaya &rarr; Customer ko full refund, supplier ko <strong>₹0</strong>!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierBankSettings;
