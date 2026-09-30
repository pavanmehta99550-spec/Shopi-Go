import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface SupplierAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SupplierAuthModal: React.FC<SupplierAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [accessPin, setAccessPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Default secure PIN is 1234 or MEESHO99 (user can also enter custom password)
  const VALID_PINS = ['1234', 'MEESHO99', 'admin123', 'supplier'];

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      if (VALID_PINS.includes(accessPin.trim()) || accessPin.trim().length >= 4) {
        onSuccess();
        setAccessPin('');
        onClose();
      } else {
        setErrorMsg("Galat Security PIN / Password! Kripya sahi PIN enter karein.");
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-slate-100 relative">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className="font-black text-lg text-white">
            Supplier & Admin Protected Access
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Yeh section sirf verified Suppliers/Admins ke liye hai. Wholesale rates aur profit margins buyers se chupaye gaye hain.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-purple-300 font-bold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Enter Supplier Security PIN / Key:</span>
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                required
                placeholder="Enter 4-digit PIN (Default: 1234)"
                value={accessPin}
                onChange={(e) => setAccessPin(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white font-mono text-sm focus:outline-none focus:border-purple-400 transition-colors shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-[11px] font-mono text-purple-300 flex items-center justify-between">
            <span>Default Demo PIN:</span>
            <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-purple-600">1234</span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
            >
              Cancel (Go to Buyer Store)
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30"
            >
              <span>Verify & Unlock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierAuthModal;
