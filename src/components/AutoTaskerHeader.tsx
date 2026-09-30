import React, { useState } from 'react';
import { Bot, Sparkles, HelpCircle, ShieldCheck, Zap, Activity, Smartphone, Globe } from 'lucide-react';
import { AgentStatus, ActiveStudioMode } from '../types';

interface AutoTaskerHeaderProps {
  status: AgentStatus;
  activeMode: ActiveStudioMode;
  onSelectMode: (mode: ActiveStudioMode) => void;
}

export const AutoTaskerHeader: React.FC<AutoTaskerHeaderProps> = ({
  status,
  activeMode,
  onSelectMode
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight font-sans">
                  AutoTasker AI
                </h1>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded-full border border-cyan-800 font-bold">
                  ऑटो वर्क एजेंट
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-sans">
                Web App Automator + Mobile Screen Tap-Dot Macro Studio
              </p>
            </div>
          </div>

          {/* Help button on mobile */}
          <button
            onClick={() => setShowHelp(true)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Central Studio Mode Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-inner w-full md:w-auto justify-center">
          <button
            onClick={() => onSelectMode('browser_agent')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold font-mono text-xs transition-all ${
              activeMode === 'browser_agent'
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. Web Apps (WhatsApp / YT / Form)</span>
          </button>

          <button
            onClick={() => onSelectMode('mobile_macro')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold font-mono text-xs transition-all ${
              activeMode === 'mobile_macro'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. Mobile Screen & Tap-Dots (ऑटो क्लिकर)</span>
          </button>
        </div>

        {/* Status Indicator & Help (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status === 'running' ? 'bg-emerald-400' : status === 'analyzing' ? 'bg-amber-400' : 'bg-cyan-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                status === 'running' ? 'bg-emerald-500' : status === 'analyzing' ? 'bg-amber-500' : 'bg-cyan-500'
              }`} />
            </span>
            <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              {status === 'running' ? 'AUTO-WORKING' : status === 'completed' ? 'TASK COMPLETED' : status.toUpperCase()}
            </span>
          </div>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Kaise kaam karta hai?"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>AutoTasker AI Kaise Kaam Karta Hai?</span>
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <strong className="text-white">Web Apps Auto-Work:</strong> WhatsApp, YouTube, Sheets ya Web form me bolkar ya likhkar instruction dein, AI khud cursor chala kar kaam karega.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <strong className="text-white">Mobile Tap-Dots Studio:</strong> Phone screen par jahan jahan click karwana ho (Dot 1, Dot 2, Dot 3 Skip button) rakh kar sequence chala sakte hain!
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <div>
                  <strong className="text-white">Real Scripts Export:</strong> Dono modes ke liye 1-Click Playwright aur Android ADB Scripts download kar sakte hain.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              Samajh Gaya (Close)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AutoTaskerHeader;
