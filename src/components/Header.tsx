import React from 'react';
import { Bot, Shield, Power, Activity, RefreshCw } from 'lucide-react';
import { AgentStatus } from '../types';

interface HeaderProps {
  status: AgentStatus;
  cycleCount: number;
  uptimeSeconds: number;
  onReset: () => void;
  onStop: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  cycleCount,
  uptimeSeconds,
  onReset,
  onStop
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="border-b border-cyan-900/40 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            {status === 'running' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wide bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                OMNI-PILOT AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                Autonomous Loop v3.8
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              App khole, kaam samjhe, aur apne aap continuous execute kare jab tak aap STOP na karein
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-2 ${
            status === 'running'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
              : status === 'analyzing'
              ? 'bg-amber-950/50 border-amber-500/40 text-amber-400 animate-pulse'
              : status === 'paused'
              ? 'bg-blue-950/50 border-blue-500/40 text-blue-400'
              : status === 'stopped'
              ? 'bg-rose-950/50 border-rose-500/40 text-rose-400'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              status === 'running' ? 'bg-emerald-400 animate-ping' : 
              status === 'analyzing' ? 'bg-amber-400 animate-bounce' :
              status === 'paused' ? 'bg-blue-400' :
              status === 'stopped' ? 'bg-rose-500' : 'bg-slate-500'
            }`} />
            <span className="uppercase tracking-wider">
              {status === 'running' ? 'LIVE AUTONOMOUS' : 
               status === 'analyzing' ? 'UNDERSTANDING GOAL...' :
               status === 'paused' ? 'PAUSED' :
               status === 'stopped' ? 'STOPPED' : 'IDLE / READY'}
            </span>
          </div>

          {/* Telemetry counters */}
          {status !== 'idle' && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cycles: <strong className="text-white">{cycleCount}</strong></span>
              </div>
              <div className="w-px h-3 bg-slate-800" />
              <div>
                <span>Uptime: <strong className="text-cyan-400">{formatTime(uptimeSeconds)}</strong></span>
              </div>
            </div>
          )}

          {/* Stop / Reset Actions */}
          {status === 'running' ? (
            <button
              onClick={onStop}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Power className="w-3.5 h-3.5" />
              <span>STOP</span>
            </button>
          ) : (
            <button
              onClick={onReset}
              title="Reset Everything"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
