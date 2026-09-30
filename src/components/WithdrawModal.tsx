import React, { useState, useEffect } from 'react';
import { 
  X, 
  Coins, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  Zap, 
  Clock,
  History,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import { WithdrawalRecord } from '../types';
import confetti from 'canvas-confetti';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSuccessfulWithdraw: (amountWithdrawn: number, feeDeducted: number) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onSuccessfulWithdraw
}) => {
  const [selectedCoin, setSelectedCoin] = useState<'BTC' | 'LTC' | 'SOL' | 'USDT'>('USDT');
  const [network, setNetwork] = useState('BNB Smart Chain (BEP-20)');
  const [walletAddress, setWalletAddress] = useState('0x73648DC4AA416e869c2BE16044134808656D3e6B');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successRecord, setSuccessRecord] = useState<WithdrawalRecord | null>(null);

  // Tab: New Withdrawal vs Withdrawal History
  const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
  const [history, setHistory] = useState<WithdrawalRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  // Fetch withdrawal history
  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/mining/withdrawals');
      const data = await res.json();
      if (data.success && data.withdrawals) {
        setHistory(data.withdrawals);
      }
    } catch (e) {
      console.warn("History fetch notice:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      setSuccessRecord(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  // 5% Admin fee calculation logic
  const feeRate = 0.05;
  const adminFee = Number((numAmount * feeRate).toFixed(8));
  const netReceived = Number((numAmount - adminFee).toFixed(8));

  const handleSetMax = (pct: number) => {
    const val = Number(((currentBalance * pct) / 100).toFixed(6));
    setAmount(val.toString());
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!walletAddress.trim()) {
      setErrorMessage(`Kripya apna ${selectedCoin} wallet address daalein.`);
      return;
    }

    if (numAmount <= 0) {
      setErrorMessage('Kripya valid withdrawal amount daalein.');
      return;
    }

    if (numAmount > currentBalance && currentBalance > 0) {
      setErrorMessage(`Insufficient balance! Aapke paas abhi ${currentBalance.toFixed(6)} ${selectedCoin} available hai.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/mining/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: walletAddress.trim(),
          amount: numAmount,
          coin: selectedCoin,
          network
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Withdrawal failed to broadcast');
      }

      setSuccessRecord(data.withdrawal);
      onSuccessfulWithdraw(numAmount, adminFee);
      loadHistory();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Withdrawal transaction error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Crypto Payout / Withdrawal</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  INSTANT
                </span>
              </h3>
              <p className="text-xs text-slate-400">Apne mined coins ko kisi bhi wallet me transfer karein</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-slate-800 flex items-center gap-4 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`pb-2.5 text-xs font-mono font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'withdraw'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Naya Withdrawal Karein</span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); loadHistory(); }}
            className={`pb-2.5 text-xs font-mono font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Withdrawal History ({history.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'withdraw' ? (
            successRecord ? (
              /* Success Receipt View */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
                  <CheckCircle2 className="w-9 h-9 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Withdrawal Successfully Broadcasted!</h4>
                  <p className="text-xs text-slate-300">
                    Aapka payout blockchain mempool me bhej diya gaya hai.
                  </p>
                </div>

                {/* Receipt Details Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Target Wallet:</span>
                    <span className="text-white truncate max-w-[200px]">{successRecord.address}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Amount:</span>
                    <span className="text-slate-200">{successRecord.grossAmount} {successRecord.coin}</span>
                  </div>
                  <div className="flex justify-between text-indigo-400">
                    <span>Admin Revenue Fee (5%):</span>
                    <span>-{successRecord.adminFeeAmount} {successRecord.coin}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800 flex justify-between font-bold text-sm text-emerald-400">
                    <span>Net Received in Wallet:</span>
                    <span>+{successRecord.netReceived} {successRecord.coin}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400">
                    <span>Blockchain TXID:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-cyan-400 truncate max-w-[140px]">{successRecord.txId}</span>
                      <button
                        onClick={() => handleCopy(successRecord.txId, 'receipt')}
                        className="text-slate-400 hover:text-white"
                        title="Copy TxID"
                      >
                        {copiedTx === 'receipt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={successRecord.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <span>View on Mempool Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setSuccessRecord(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono uppercase"
                  >
                    Ek Aur Withdrawal Karein
                  </button>
                </div>
              </div>
            ) : (
              /* Withdrawal Form */
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                {/* Available Balance Display Card */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border border-cyan-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      Available Mining Balance:
                    </div>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                      {currentBalance.toFixed(6)} <span className="text-xs text-white">BTC</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      ≈ ${(currentBalance * 64250).toFixed(2)} USD
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                      READY TO PAYOUT
                    </span>
                  </div>
                </div>

                {/* Coin Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Coin Select Karein:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'BTC', label: 'Bitcoin (BTC)' },
                      { id: 'LTC', label: 'Litecoin (LTC)' },
                      { id: 'SOL', label: 'Solana (SOL)' },
                      { id: 'USDT', label: 'Tether (USDT)' }
                    ].map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => {
                          setSelectedCoin(c.id as any);
                          if (c.id === 'USDT') setNetwork('BNB Smart Chain (BEP-20)');
                          else if (c.id === 'BTC') setNetwork('Bitcoin Mainnet');
                          else if (c.id === 'LTC') setNetwork('Litecoin Network');
                          else if (c.id === 'SOL') setNetwork('Solana Mainnet');
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
                          selectedCoin === c.id
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {c.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Network Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Payout Network:</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                  >
                    {selectedCoin === 'USDT' ? (
                      <>
                        <option value="BNB Smart Chain (BEP-20)">BNB Smart Chain (BEP-20) - Fast & Low Fee</option>
                        <option value="Polygon (MATIC)">Polygon Network (MATIC)</option>
                        <option value="Tron (TRC-20)">Tron Network (TRC-20)</option>
                      </>
                    ) : selectedCoin === 'BTC' ? (
                      <>
                        <option value="Bitcoin Mainnet">Bitcoin Mainnet (Direct On-Chain)</option>
                        <option value="Lightning Network">Lightning Network (Instant • Zero Fee)</option>
                        <option value="BEP20 / BSC">BNB Smart Chain (BEP20)</option>
                      </>
                    ) : selectedCoin === 'LTC' ? (
                      <option value="Litecoin Network">Litecoin Mainnet (Low Fee)</option>
                    ) : (
                      <option value="Solana Mainnet">Solana Mainnet (Fastest Confirmation)</option>
                    )}
                  </select>
                </div>

                {/* Destination Wallet Address Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>Aapka {selectedCoin} Wallet Address:</span>
                    <span className="text-[10px] text-slate-500">{selectedCoin === 'USDT' ? 'e.g. 0x... (BEP-20)' : 'e.g. bc1q... ya 1A1zP...'}</span>
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder={`Apna ${selectedCoin} wallet address paste karein`}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Amount to Withdraw with Quick % Buttons */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-400">Kitna Withdraw Karna Hai?</label>
                    <div className="flex items-center gap-1.5">
                      {[25, 50, 75, 100].map((pct) => (
                        <button
                          type="button"
                          key={pct}
                          onClick={() => handleSetMax(pct)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-mono font-bold"
                        >
                          {pct === 100 ? 'MAX' : `${pct}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      max={currentBalance}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.005000"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-3.5 top-3 text-xs font-mono text-slate-400 font-bold">
                      {selectedCoin}
                    </span>
                  </div>
                </div>

                {/* 5% Fee Breakdown Calculation Banner */}
                {numAmount > 0 && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Requested:</span>
                      <span className="text-white">{numAmount.toFixed(6)} {selectedCoin}</span>
                    </div>
                    <div className="flex justify-between text-indigo-400">
                      <span>Admin Revenue Fee (5%):</span>
                      <span>-{adminFee.toFixed(6)} {selectedCoin}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-800 flex justify-between font-bold text-emerald-400">
                      <span>Aapko Receive Hoga (Net Payout):</span>
                      <span>+{netReceived > 0 ? netReceived.toFixed(6) : '0.000000'} {selectedCoin}</span>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || numAmount <= 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                      <span>BROADCASTING TRANSACTION...</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      <span>WITHDRAW NOW (पैसे ट्रांसफर करें)</span>
                    </>
                  )}
                </button>
              </form>
            )
          ) : (
            /* History View */
            <div className="space-y-3">
              {isLoadingHistory ? (
                <div className="text-center py-8 text-xs font-mono text-slate-400">
                  Loading withdrawal history...
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-xs font-mono text-slate-400">
                  Abhi tak koi withdrawal nahi hua hai.
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          {item.status}
                        </span>
                        <span className="font-bold text-white text-sm">+{item.netReceived} {item.coin}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-slate-400 text-[11px] truncate">
                      To: <span className="text-slate-200">{item.address}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
                      <span className="text-indigo-400">5% Admin Fee: {item.adminFeeAmount} {item.coin}</span>
                      <a
                        href={item.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>Mempool</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
