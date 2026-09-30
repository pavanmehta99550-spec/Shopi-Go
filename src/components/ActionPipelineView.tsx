import React from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { AutomationStep } from '../types';

interface ActionPipelineViewProps {
  steps: AutomationStep[];
  currentStepIndex: number;
  goalSummaryHindi: string;
  agentStatus: string;
}

export const ActionPipelineView: React.FC<ActionPipelineViewProps> = ({
  steps,
  currentStepIndex,
  goalSummaryHindi,
  agentStatus
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl font-mono text-xs">
      {/* Header & Goal Summary */}
      <div className="space-y-1.5 pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>AI Automated Action Pipeline</span>
          </div>
          <span className="text-[11px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            {steps.filter(s => s.status === 'completed').length} / {steps.length} Steps Done
          </span>
        </div>

        {goalSummaryHindi && (
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-cyan-400 font-bold">Target Goal: </span>
            {goalSummaryHindi}
          </p>
        )}
      </div>

      {/* Step Sequence List */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex && agentStatus === 'running';
          const isDone = step.status === 'completed';
          const isPending = step.status === 'pending';

          return (
            <div
              key={step.id || idx}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                isCurrent
                  ? 'bg-cyan-950/50 border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                  : isDone
                  ? 'bg-slate-950/80 border-emerald-900/40 opacity-90'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              {/* Step Status Icon */}
              <div className="shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-[11px] animate-spin">
                    ⚙
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[11px]">
                    {idx + 1}
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-white text-xs truncate">
                    {step.title}
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider shrink-0 ${
                    step.actionType === 'CLICK'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : step.actionType === 'TYPE'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : step.actionType === 'NAVIGATE'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {step.actionType}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {step.description}
                </p>

                {step.targetSelector && (
                  <div className="text-[10px] text-cyan-400/80 truncate">
                    Selector: <code className="text-slate-300">{step.targetSelector}</code>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionPipelineView;
