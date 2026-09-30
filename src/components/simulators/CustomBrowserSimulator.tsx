import React, { useEffect, useState } from 'react';
import { Globe, Lock, ArrowRight, CheckCircle2, Search, Zap } from 'lucide-react';
import { AutomationStep } from '../../types';

interface CustomBrowserSimulatorProps {
  appName: string;
  appUrl: string;
  currentStep: AutomationStep | null;
  stepProgress: number;
}

export const CustomBrowserSimulator: React.FC<CustomBrowserSimulatorProps> = ({
  appName,
  appUrl,
  currentStep,
  stepProgress
}) => {
  const [queryValue, setQueryValue] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!currentStep) return;

    if (currentStep.actionType === 'TYPE' && currentStep.paramValue) {
      setQueryValue(currentStep.paramValue);
    }

    if (currentStep.actionType === 'VERIFY') {
      setIsCompleted(true);
    }
  }, [currentStep]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 font-sans select-none text-xs">
      {/* Top Browser URL Navigation */}
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>

        <div className="flex-1 max-w-lg bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-300">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span className="text-slate-500">https://</span>
          <span className="text-cyan-400">{appUrl || 'app.service.com'}</span>
          <span className="text-slate-600">/automated</span>
        </div>

        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
          DOM INJECTED
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Globe className="w-7 h-7" />
        </div>

        <div className="space-y-1 max-w-md">
          <h3 className="font-bold text-white text-base">
            Autonomous Session: {appName || 'Target Application'}
          </h3>
          <p className="text-xs text-slate-400">
            Real-time viewport listening to agent commands and DOM mutations.
          </p>
        </div>

        {/* Simulated Interactive Box on Target Site */}
        <div className="w-full max-w-sm p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-left">
          <div className="text-[11px] font-semibold text-slate-300">Target Interactive Element:</div>
          <div
            id="main-content-input"
            className={`p-2.5 rounded-lg bg-slate-950 border text-xs text-white min-h-[40px] flex items-center ${
              currentStep?.targetSelector === '#main-content-input'
                ? 'border-cyan-400 ring-2 ring-cyan-500/50'
                : 'border-slate-800'
            }`}
          >
            {queryValue || <span className="text-slate-600">Waiting for agent text input...</span>}
          </div>

          <button
            id="btn-confirm-action"
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              currentStep?.targetSelector === '#btn-confirm-action'
                ? 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-200'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Execute Action</span>
          </button>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Target Web Action Verified Successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomBrowserSimulator;
