import React, { useState, useEffect, useRef } from 'react';
import { 
  Pickaxe, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight, 
  Coins, 
  ShieldCheck, 
  MousePointer2, 
  Flame, 
  TrendingUp, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  Server,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export interface MiningDataPoint {
  time: string;
  rawTimestamp: number;
  earnings: number;
  earningsUsd: number;
  shares: number;
  hashrate: number;
}

const CustomMiningTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MiningDataPoint;
    return (
      <div className="bg-slate-950/95 border border-cyan-800/80 p-2.5 rounded-xl shadow-2xl backdrop-blur-md font-mono text-[11px] space-y-1 z-50">
        <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between gap-3">
          <span>Time: {label}</span>
          <span className="text-[9px] text-cyan-400">Past 30m Stream</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-amber-400 font-bold pt-0.5">
          <span>BTC Earnings:</span>
          <span>{data.earnings.toFixed(6)} BTC</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-emerald-400 text-[10px]">
          <span>USD Value:</span>
          <span>${data.earningsUsd.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-cyan-300 text-[10px]">
          <span>Shares Submitted:</span>
          <span>{data.shares} Shares</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-500 text-[9px]">
          <span>Hashrate:</span>
          <span>{data.hashrate} TH/s</span>
        </div>
      </div>
    );
  }
  return null;
};

interface AutoGhostAppProps {
  appMode: 'laptop_mining' | 'mining' | 'trading' | 'social' | 'web';
  isAutoWorking: boolean;
  onAutoAction: (actionText: string, targetName: string) => void;
  speed: number;
  btcBalance: number;
  adminCut: number;
  onOpenWithdraw: () => void;
  onUpdateBalances: (newBtc: number, newAdmin: number) => void;
}

export const AutoGhostApp: React.FC<AutoGhostAppProps> = ({
  appMode,
  isAutoWorking,
  onAutoAction,
  speed,
  btcBalance,
  adminCut,
  onOpenWithdraw,
  onUpdateBalances
}) => {
  // Cursor coordinate simulation
  const [cursorPos, setCursorPos] = useState({ x: 120, y: 140 });
  const [cursorTargetText, setCursorTargetText] = useState('Initializing AI Control...');
  const [isClicking, setIsClicking] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  // App 1: Mining Pool Live Auto State
  const [poolConnected, setPoolConnected] = useState(true);
  const [hashrate, setHashrate] = useState(184.2);
  const [sharesSubmitted, setSharesSubmitted] = useState(24);
  const [activeWorkerIndex, setActiveWorkerIndex] = useState(0);
  const [autoStatusMessage, setAutoStatusMessage] = useState('AI automatically validating block nonces...');

  // 30-Minute Dynamic Earnings History State for Recharts Line Chart
  const [earningsHistory, setEarningsHistory] = useState<MiningDataPoint[]>(() => {
    const points: MiningDataPoint[] = [];
    const now = Date.now();
    const intervals = 10; // 10 points spanning the last 30 minutes
    const stepMs = (30 * 60 * 1000) / intervals; // every 3 minutes
    const baseBtc = 0.008100;
    
    for (let i = intervals; i >= 0; i--) {
      const timeMs = now - (i * stepMs);
      const d = new Date(timeMs);
      const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      const progress = (intervals - i) / intervals;
      const btc = Number((baseBtc + progress * 0.000320).toFixed(6));
      const shares = Math.max(0, Math.floor(10 + progress * 14));
      points.push({
        time: i === 0 ? 'Now' : timeStr,
        rawTimestamp: timeMs,
        earnings: btc,
        earningsUsd: Number((btc * 64250).toFixed(2)),
        shares,
        hashrate: Number((182 + Math.sin(i) * 3).toFixed(1))
      });
    }
    return points;
  });

  // App 2: Trading Auto State
  const [tradePair, setTradePair] = useState('BTC/USDT');
  const [orderBook, setOrderBook] = useState<{ id: number; type: 'BUY' | 'SELL'; price: string; amount: string }[]>([
    { id: 1, type: 'BUY', price: '64,250.00', amount: '0.45 BTC' },
    { id: 2, type: 'SELL', price: '64,280.50', amount: '1.20 BTC' },
    { id: 3, type: 'BUY', price: '64,245.00', amount: '0.88 BTC' }
  ]);
  const [tradingPnl, setTradingPnl] = useState(480.25);

  // App 3: Social Auto State
  const [socialFeed, setSocialFeed] = useState([
    { id: 1, author: '@crypto_whale', text: 'Stratum protocol efficiency is up 12% today!', status: 'AUTO-LIKED & REPLIED' },
    { id: 2, author: '@tech_daily', text: 'Who is using automated AI mining agents?', status: 'AUTO-REPLIED' },
    { id: 3, author: '@dev_hub', text: 'Building next-gen decentralized bots.', status: 'PENDING' }
  ]);

  // Target DOM element coordinates inside the virtual screen
  const containerRef = useRef<HTMLDivElement>(null);

  // Automation sequence generator
  useEffect(() => {
    if (!isAutoWorking) return;

    const intervalTime = Math.max(900, Math.floor(2500 / speed));

    const steps = [
      // Mining action steps
      { x: 180, y: 110, target: 'connect_btn', label: 'Auto-Clicking: Stratum Pool Re-sync' },
      { x: 340, y: 190, target: 'worker_node', label: 'Auto-Selecting: High-Efficiency Worker Node' },
      { x: 220, y: 260, target: 'submit_shares', label: 'Auto-Submitting: Nonce Proof-of-Work Shares' },
      { x: 480, y: 150, target: 'payout_claim', label: 'Auto-Claiming: Multi-Coin Mining Yield' },
      { x: 380, y: 320, target: 'difficulty_slider', label: 'Auto-Optimizing: Stratum Difficulty Target' }
    ];

    let currentStep = 0;

    const timer = setInterval(() => {
      const step = steps[currentStep % steps.length];
      currentStep++;

      // 1. Move cursor to target
      setCursorPos({ x: step.x, y: step.y });
      setCursorTargetText(step.label);
      setHighlightedElement(step.target);

      // 2. Simulate Click ripple
      setTimeout(() => {
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 300);

        // Perform actual virtual application state update
        if (appMode === 'mining') {
          if (step.target === 'submit_shares') {
            const earned = 0.000021;
            const newBtc = Number((btcBalance + earned * 0.95).toFixed(6));
            const newAdmin = Number((adminCut + earned * 0.05).toFixed(6));
            const newHash = Number((hashrate + (Math.random() * 2 - 1)).toFixed(1));
            
            setSharesSubmitted((prevShares) => {
              const nextShares = prevShares + 1;
              
              // Dynamically append new share submission data to the last 30 minutes history
              setEarningsHistory((prevHistory) => {
                const now = Date.now();
                const cutoff = now - (30 * 60 * 1000); // 30-minute rolling window
                const d = new Date(now);
                const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
                
                const newPoint: MiningDataPoint = {
                  time: timeStr,
                  rawTimestamp: now,
                  earnings: newBtc,
                  earningsUsd: Number((newBtc * 64250).toFixed(2)),
                  shares: nextShares,
                  hashrate: newHash
                };
                
                const filtered = prevHistory.filter((pt) => pt.rawTimestamp >= cutoff);
                return [...filtered, newPoint];
              });

              return nextShares;
            });

            setHashrate(newHash);
            onUpdateBalances(newBtc, newAdmin);
            setAutoStatusMessage('AI auto-submitted verified share #0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16));
            onAutoAction('Valid PoW Share Submitted to Pool (Recharts Updated)', 'Stratum Worker');
          } else if (step.target === 'worker_node') {
            setActiveWorkerIndex((prev) => (prev + 1) % 3);
            setAutoStatusMessage('AI auto-balanced worker load across nodes.');
            onAutoAction('Worker Load Optimized', 'Worker-Node');
          } else if (step.target === 'payout_claim') {
            setAutoStatusMessage('AI auto-calculated 5% admin fee and updated balances in Firestore.');
            onAutoAction('Yield Auto-Claimed & Settled', 'Firestore Ledger');
          }
        } else if (appMode === 'trading') {
          setTradingPnl((p) => Number((p + (Math.random() * 8 - 2)).toFixed(2)));
          setOrderBook((prev) => [
            { id: Date.now(), type: Math.random() > 0.5 ? 'BUY' : 'SELL', price: (64200 + Math.random() * 150).toFixed(2), amount: (0.2 + Math.random() * 1.5).toFixed(2) + ' BTC' },
            ...prev.slice(0, 3)
          ]);
          onAutoAction('Auto-executed market arbitrage order', 'OrderBook Engine');
        } else if (appMode === 'social') {
          onAutoAction('Auto-scanned mention & posted AI smart reply', 'Social Stream');
        }
      }, 500);

    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAutoWorking, appMode, speed, onAutoAction]);

  return (
    <div 
      ref={containerRef}
      className="relative rounded-2xl bg-slate-950 border border-cyan-800/60 shadow-2xl overflow-hidden select-none min-h-[480px] flex flex-col"
    >
      {/* Top Banner: AI Full Auto-Pilot Mode */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 px-4 py-2.5 border-b border-cyan-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
            <span className="text-cyan-400">100% AUTO-WORK ACTIVE:</span>
            <span className="text-slate-300">Aapko kuch karne ki zaroorat nahi hai, AI sab khud chala raha hai!</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>GHOST HAND RPA</span>
          </span>
        </div>
      </div>

      {/* Simulated Ghost AI Mouse Pointer */}
      {isAutoWorking && (
        <div 
          className="absolute z-50 pointer-events-none transition-all duration-500 ease-out"
          style={{ 
            left: `${cursorPos.x}px`, 
            top: `${cursorPos.y}px`,
            transform: 'translate(-4px, -4px)'
          }}
        >
          {/* Mouse cursor icon */}
          <div className="relative">
            <MousePointer2 className="w-6 h-6 fill-cyan-400 text-slate-950 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            
            {/* Click Ripple wave */}
            {isClicking && (
              <span className="absolute -top-3 -left-3 w-12 h-12 rounded-full border-2 border-cyan-400 bg-cyan-500/30 animate-ping pointer-events-none" />
            )}

            {/* Floating Action Tag */}
            <div className="absolute left-6 -top-2 whitespace-nowrap bg-slate-900/95 border border-cyan-400 text-cyan-200 text-[10px] font-mono font-bold px-2 py-1 rounded-md shadow-xl backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>{cursorTargetText}</span>
            </div>
          </div>
        </div>
      )}

      {/* APP MODE 1: MINING POOL AUTOMATION */}
      {appMode === 'mining' && (
        <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Pickaxe className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span>AntPool & F2Pool Stratum Bridge</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                    AUTO-CONNECTED
                  </span>
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  stratum+tcp://btc-live.pool.network:3333 • Handshake: mining.subscribe (OK)
                </p>
              </div>
            </div>

            {/* Connect / Disconnect button auto-managed by AI */}
            <div className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
              highlightedElement === 'connect_btn'
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-400/50 scale-105'
                : 'bg-slate-800/80 text-emerald-400 border-emerald-900'
            }`}>
              ⚡ STRATUM SOCKET LIVE
            </div>
          </div>

          {/* Real-time Metric Dials */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Hashrate</span>
              </div>
              <div className="text-xl font-mono font-bold text-white">
                {hashrate.toFixed(1)} <span className="text-xs text-slate-400">TH/s</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                Auto-tuned by AI
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all ${
              highlightedElement === 'submit_shares'
                ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-Shares</span>
              </div>
              <div className="text-xl font-mono font-bold text-cyan-300">
                {sharesSubmitted} <span className="text-xs text-slate-400">Accepted</span>
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                0 Stale • 0 Rejected
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
              highlightedElement === 'payout_claim'
                ? 'bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-950'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div>
                <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>User Net Yield</span>
                </div>
                <div className="text-xl font-mono font-bold text-amber-400">
                  {btcBalance.toFixed(6)} <span className="text-xs text-slate-400">BTC</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Auto-updating • ≈ ${(btcBalance * 64250).toFixed(2)}
                </div>
              </div>

              {/* Instant BTC Withdrawal Button */}
              <button
                onClick={onOpenWithdraw}
                className="mt-2.5 w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>WITHDRAW BTC</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admin Fee (5%)</span>
              </div>
              <div className="text-xl font-mono font-bold text-indigo-300">
                +{adminCut.toFixed(6)} <span className="text-xs text-slate-400">BTC</span>
              </div>
              <div className="text-[10px] text-indigo-400 font-mono mt-0.5">
                Firestore Auto-Settled
              </div>
            </div>
          </div>

          {/* Dynamic Recharts Line Chart: Last 30 Minutes of Earnings History */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white flex items-center gap-2 font-mono">
                    <span>LAST 30 MINUTES EARNINGS HISTORY</span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE STREAM (30m)
                    </span>
                  </h5>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Dynamic Recharts stream • Auto-updated upon every new Stratum share submission ({sharesSubmitted} shares logged)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono">
                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-bold">
                  Yield: {btcBalance.toFixed(6)} BTC
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 font-bold">
                  ≈ ${(btcBalance * 64250).toFixed(2)} USD
                </div>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="w-full h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={earningsHistory}
                  margin={{ top: 8, right: 12, left: -8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#f59e0b"
                    tick={{ fontSize: 9, fill: '#f59e0b', fontFamily: 'monospace' }}
                    tickFormatter={(v: number) => v.toFixed(6)}
                    domain={['dataMin - 0.00004', 'dataMax + 0.00004']}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#06b6d4"
                    tick={{ fontSize: 9, fill: '#06b6d4', fontFamily: 'monospace' }}
                    tickFormatter={(v: number) => `${v} sh`}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomMiningTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '4px' }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="earnings"
                    name="BTC Earnings"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: '#f59e0b', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#fbbf24', stroke: '#0f172a', strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="shares"
                    name="Submitted Shares"
                    stroke="#06b6d4"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ r: 2, fill: '#06b6d4', strokeWidth: 0 }}
                    activeDot={{ r: 4, fill: '#22d3ee', stroke: '#0f172a', strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Worker Nodes being auto-operated */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Worker Nodes (AI Auto-Switching & Balancing):</span>
              <span className="text-cyan-400 font-bold">100% Autonomous Control</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Worker-BTC-01', coin: 'BTC', algo: 'SHA-256', rate: '124.5 TH/s' },
                { name: 'Worker-LTC-02', coin: 'LTC', algo: 'Scrypt', rate: '52.1 GH/s' },
                { name: 'Worker-SOL-03', coin: 'SOL/USDT', algo: 'PoW Proxy', rate: '7.6 TH/s' },
              ].map((w, idx) => {
                const isActive = activeWorkerIndex === idx;
                return (
                  <div
                    key={w.name}
                    className={`p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950 ring-1 ring-cyan-500/40'
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
                        {w.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {w.coin}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                      <span>Rate: <strong className="text-slate-200">{w.rate}</strong></span>
                      <span className="text-[10px] text-cyan-400">{isActive ? 'AI HASHING NOW' : 'Standby'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Action Toast Banner */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-900/50 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{autoStatusMessage}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Zero manual input required
            </div>
          </div>
        </div>
      )}

      {/* APP MODE 2: TRADING BOT AUTOMATION */}
      {appMode === 'trading' && (
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Autonomous Trading Terminal ({tradePair})</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                  ARBITRAGE SCANNER ON
                </span>
              </div>
              <p className="text-xs text-slate-400">AI auto-detecting price spread and executing arbitrage trades</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-mono">Auto Net PnL</div>
              <div className="text-lg font-bold font-mono text-emerald-400">+${tradingPnl.toFixed(2)} USDT</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400">Live Auto-Executed Orders:</div>
            <div className="space-y-1.5 font-mono text-xs">
              {orderBook.map((ord) => (
                <div key={ord.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.type === 'BUY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {ord.type}
                    </span>
                    <span className="text-white">${ord.price}</span>
                  </div>
                  <div className="text-slate-300">{ord.amount}</div>
                  <div className="text-emerald-400 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Auto-Filled by AI</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* APP MODE 3: SOCIAL MEDIA AUTOMATION */}
      {appMode === 'social' && (
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Social Community Auto-Pilot</h4>
              <p className="text-xs text-slate-400">AI auto-scanning mentions, auto-liking, and auto-replying</p>
            </div>
            <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 text-xs font-mono">
              Auto-Engagement: 100%
            </span>
          </div>

          <div className="space-y-2">
            {socialFeed.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-cyan-400">{item.author}</div>
                  <div className="text-slate-300 mt-0.5">{item.text}</div>
                </div>
                <span className="px-2 py-1 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-mono">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APP MODE 4: WEB AUTOMATION */}
      {appMode === 'web' && (
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Universal Web & App RPA Bot</h4>
              <p className="text-xs text-slate-400">AI auto-filling forms, clicking buttons, and completing tasks</p>
            </div>
            <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 text-xs font-mono">
              Ghost Hand Enabled
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 font-mono text-xs space-y-2">
            <div className="text-slate-400">Current Autonomous Step:</div>
            <div className="text-cyan-300 text-sm font-bold">{cursorTargetText}</div>
            <div className="text-slate-500 text-[11px]">User effort required: 0% • Everything is automated</div>
          </div>
        </div>
      )}
    </div>
  );
};
