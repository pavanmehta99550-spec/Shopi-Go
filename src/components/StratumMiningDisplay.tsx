import React from 'react';
import { Pickaxe, Cpu, Server, ShieldCheck, Zap, Coins, ArrowUpRight } from 'lucide-react';

interface StratumMiningDisplayProps {
  metrics: {
    hashrate: string;
    shares: number;
    btcYield: number;
    ltcYield: number;
    adminRevenueFee: number;
  };
  lastAction?: string;
  activeWorker: string;
}

export const StratumMiningDisplay: React.FC<StratumMiningDisplayProps> = ({
  metrics,
  lastAction,
  activeWorker
}) => {
  return (
    <div className="bg-slate-950/80 rounded-2xl border border-cyan-900/60 p-5 space-y-5">
      {/* Stratum Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Pickaxe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-white">STRATUM PROTOCOL BRIDGE</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                CONNECTED (TCP/SSL)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Pool: stratum+tcp://btc-pool.global.network:3333 | RPC: mining.subscribe (JSON-RPC 2.0)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Fee Architecture:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
            5% Admin Revenue Cut
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Aggregate Hashrate</span>
          </div>
          <div className="text-lg font-mono font-bold text-white tracking-tight">
            {metrics.hashrate}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
            Optimal • 0% Stale
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Validated Shares</span>
          </div>
          <div className="text-lg font-mono font-bold text-cyan-300 tracking-tight">
            {metrics.shares.toLocaleString()}
          </div>
          <div className="text-[10px] text-cyan-500 font-mono mt-0.5">
            100% Difficulty Target
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>User Mining Yield</span>
          </div>
          <div className="text-lg font-mono font-bold text-amber-400 tracking-tight">
            {metrics.btcYield.toFixed(6)} BTC
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            ≈ {(metrics.ltcYield).toFixed(4)} LTC
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin Rev. (5%)</span>
          </div>
          <div className="text-lg font-mono font-bold text-indigo-300 tracking-tight">
            +{metrics.adminRevenueFee.toFixed(6)} BTC
          </div>
          <div className="text-[10px] text-indigo-400 font-mono mt-0.5">
            Auto-Settled in Firestore
          </div>
        </div>
      </div>

      {/* Stratum Active Workers Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Active Stratum Worker Nodes:</span>
          <span className="text-emerald-400">3/3 Online & Hashing</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'worker-btc-01', coin: 'BTC', algo: 'SHA-256', rate: '124.2 TH/s', diff: '65,536' },
            { id: 'worker-ltc-02', coin: 'LTC', algo: 'Scrypt', rate: '52.1 GH/s', diff: '16,384' },
            { id: 'worker-sol-03', coin: 'SOL/USDT', algo: 'SHA-256d', rate: '8.2 TH/s', diff: '8,192' },
          ].map((w) => {
            const isTargeted = activeWorker.toLowerCase().includes(w.coin.toLowerCase()) || activeWorker.toLowerCase().includes(w.id);
            return (
              <div
                key={w.id}
                className={`p-3 rounded-xl border transition-all ${
                  isTargeted
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {w.id}
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded">
                    {w.coin}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Rate: <strong className="text-slate-200">{w.rate}</strong></span>
                  <span>Diff: <span className="text-cyan-400">{w.diff}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
