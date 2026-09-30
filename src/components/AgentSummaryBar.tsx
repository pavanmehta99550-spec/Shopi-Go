import React from 'react';
import { Bot, CheckCircle, Info, Sparkles, AlertCircle } from 'lucide-react';
import { AgentPlan, AgentStatus } from '../types';

interface AgentSummaryBarProps {
  plan: AgentPlan;
  status: AgentStatus;
}

export const AgentSummaryBar: React.FC<AgentSummaryBarProps> = ({ plan, status }) => {
  return (
    <div className="bg-slate-900/60 border border-cyan-900/40 rounded-2xl p-4 md:p-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: AI understanding */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                AI KA SAMAJH (UNDERSTOOD OBJECTIVE):
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {plan.appName}
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1 leading-snug">
              {plan.goalSummaryHindi || plan.goalSummaryEnglish}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous Loop Frequency: ~{((plan.executionLoopIntervalMs || 3000) / 1000).toFixed(1)}s per cycle • Working autonomously
            </p>
          </div>
        </div>

        {/* Right: Loop Status Badge */}
        <div className="shrink-0 flex items-center gap-2">
          {status === 'running' ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LOOP ACTIVE (CHAL RAHA HAI)</span>
            </div>
          ) : status === 'stopped' ? (
            <div className="px-3 py-1.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>STOPPED BY USER</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-500/40 text-blue-300 font-mono text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span>PAUSED</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
