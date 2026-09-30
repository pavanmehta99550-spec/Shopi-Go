import React, { useState } from 'react';
import { 
  Power, 
  Pause, 
  Play, 
  FastForward, 
  Send, 
  MessageSquarePlus, 
  AlertTriangle,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { AgentStatus } from '../types';

interface ControlDockProps {
  status: AgentStatus;
  speed: number;
  onStop: () => void;
  onTogglePause: () => void;
  onChangeSpeed: (newSpeed: number) => void;
  onStepNext: () => void;
  onSendOverride: (command: string) => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  status,
  speed,
  onStop,
  onTogglePause,
  onChangeSpeed,
  onStepNext,
  onSendOverride
}) => {
  const [overrideInput, setOverrideInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideInput.trim()) return;
    onSendOverride(overrideInput.trim());
    setOverrideInput('');
  };

  const isRunning = status === 'running';
  const isPaused = status === 'paused';

  return (
    <div className="bg-slate-900/90 border border-cyan-900/60 rounded-2xl p-4 md:p-5 shadow-2xl backdrop-blur-md space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Emergency STOP & Pause */}
        <div className="flex flex-wrap items-center gap-3">
          {/* BIG TACTILE EMERGENCY STOP */}
          <button
            onClick={onStop}
            className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-rose-600/40 border border-rose-400/30 transition-all hover:scale-105 active:scale-95 animate-pulse"
          >
            <Power className="w-5 h-5" />
            <span>EMERGENCY STOP (काम रोको)</span>
          </button>

          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            className={`px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 border transition-all ${
              isPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? 'Resume Work' : 'Pause Loop'}</span>
          </button>

          {/* Step next manual button when paused */}
          {isPaused && (
            <button
              onClick={onStepNext}
              className="px-3 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 font-mono text-xs flex items-center gap-1.5 transition-all"
            >
              <FastForward className="w-4 h-4" />
              <span>Step +1</span>
            </button>
          )}
        </div>

        {/* Middle: Speed Controls */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            Loop Speed:
          </span>
          {[
            { label: '1x Normal', val: 1 },
            { label: '2x Turbo', val: 2 },
            { label: '4x Hyper', val: 4 }
          ].map((s) => (
            <button
              key={s.val}
              onClick={() => onChangeSpeed(s.val)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                speed === s.val
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom: Live Human Intervention Input */}
      <form onSubmit={handleSend} className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
          <MessageSquarePlus className="w-4 h-4 text-cyan-400" />
          <span>Live Directive (Chalti app me naya order dein):</span>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={overrideInput}
            onChange={(e) => setOverrideInput(e.target.value)}
            placeholder="Jaise: 'LTC hashrate badhao', 'Interval 2 second karo', 'Current balance check karo'..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />

          <button
            type="submit"
            disabled={!overrideInput.trim()}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Order</span>
          </button>
        </div>
      </form>
    </div>
  );
};
