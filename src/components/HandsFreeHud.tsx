import React from 'react';
import { 
  Power, 
  Play, 
  Pause, 
  FastForward, 
  Sparkles, 
  ShieldCheck, 
  Pickaxe, 
  TrendingUp, 
  MessageSquare, 
  Globe,
  Coins,
  ArrowUpRight,
  Laptop
} from 'lucide-react';

interface HandsFreeHudProps {
  appMode: 'laptop_mining' | 'mining' | 'trading' | 'social' | 'web';
  onSelectMode: (mode: 'laptop_mining' | 'mining' | 'trading' | 'social' | 'web') => void;
  isAutoWorking: boolean;
  onToggleAutoWork: () => void;
  speed: number;
  onChangeSpeed: (newSpeed: number) => void;
  autoActionsCount: number;
  onOpenWithdraw: () => void;
  btcBalance: number;
}

export const HandsFreeHud: React.FC<HandsFreeHudProps> = ({
  appMode,
  onSelectMode,
  isAutoWorking,
  onToggleAutoWork,
  speed,
  onChangeSpeed,
  autoActionsCount,
  onOpenWithdraw,
  btcBalance
}) => {
  return (
    <div className="bg-slate-900/90 border border-cyan-800/80 rounded-2xl p-4 md:p-5 shadow-2xl backdrop-blur-md space-y-4">
      {/* Top Banner Message */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <span>ZERO-EFFORT AUTO WORK ACTIVE</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isAutoWorking ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {isAutoWorking ? 'RUNNING AUTOMATICALLY' : 'STOPPED'}
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Aapko is app me koi bhi button dabane ya kaam karne ki zaroorat nahi hai. <strong className="text-cyan-400">AI sab kuch khud kar raha hai!</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons: Withdraw BTC & Stop / Start */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Quick Withdraw Button */}
          <button
            onClick={onOpenWithdraw}
            className="flex-1 md:flex-none px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 shadow-xl shadow-amber-500/20 border border-amber-400/40 transition-all hover:scale-105 active:scale-95"
          >
            <Coins className="w-4 h-4" />
            <span>WITHDRAW BTC ({btcBalance.toFixed(4)})</span>
          </button>

          {/* Big Stop / Start Button */}
          <button
            onClick={onToggleAutoWork}
            className={`flex-1 md:flex-none px-5 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-105 active:scale-95 ${
              isAutoWorking
                ? 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/30 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isAutoWorking ? 'STOP AUTO-WORK' : 'START AUTO-WORK'}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Select Which App To Auto-Work In & Speed */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* App Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-slate-400 shrink-0 hidden sm:inline">Auto-Run App:</span>
          {[
            { id: 'laptop_mining', label: '💻 Laptop Real Mining', icon: Laptop },
            { id: 'mining', label: 'Stratum Sim Pool', icon: Pickaxe },
            { id: 'trading', label: 'Trading & Arbitrage', icon: TrendingUp },
            { id: 'social', label: 'Social & Chat', icon: MessageSquare },
            { id: 'web', label: 'Web Auto-Bot', icon: Globe }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = appMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMode(item.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side stats & speed */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Auto-Actions Done: <strong className="text-cyan-400">{autoActionsCount}</strong>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[11px] mr-1">Speed:</span>
            {[
              { val: 1, label: '1x' },
              { val: 2, label: '2x' },
              { val: 4, label: '4x' }
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => onChangeSpeed(s.val)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  speed === s.val ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
