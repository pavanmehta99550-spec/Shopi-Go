import React, { useState } from 'react';
import { Lock, Crown, ShieldAlert, CheckCircle2, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';

interface CreatorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatorAuthModal: React.FC<CreatorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [accessPin, setAccessPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // App Creator Master Passwords / PINs (Exclusive to Pavan Mehta)
  const CREATOR_PINS = ['pavan99', 'PAVAN99', '99550', 'admin99', 'pavanmehta', '1234'];

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      if (CREATOR_PINS.includes(accessPin.trim()) || accessPin.trim().toLowerCase() === 'pavan' || accessPin.trim() === '1234') {
        onSuccess();
        setAccessPin('');
        onClose();
      } else {
        setErrorMsg("Galat Creator PIN! Yeh dashboard sirf app owner Pavan Mehta ke liye hai. (Default PIN: 1234 ya 99550)");
      }
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-slate-100 relative">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Crown className="w-8 h-8 animate-pulse text-amber-400" />
          </div>
          <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-400 text-slate-950 uppercase">
            APP CREATOR / MASTER ADMIN ONLY
          </span>
          <h3 className="font-black text-xl text-white">
            Pavan Mehta Master Access
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Yeh separate Admin Panel sirf aapke liye hai jisne yeh app banayi hai. Kisi aur supplier ya user ko iska access nahi hai.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Enter Creator Master PIN / Password</span>
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                placeholder="Enter PIN (e.g. 1234 or 99550)"
                value={accessPin}
                onChange={(e) => setAccessPin(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border-2 border-amber-500/40 rounded-xl text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-amber-400 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono text-center">
              Quick Master PIN: <strong className="text-amber-400">1234</strong> or <strong className="text-amber-400">99550</strong>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : 'UNLOCK MASTER ADMIN'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatorAuthModal;
