import React from 'react';
import { Globe, Lock, ShieldCheck, ArrowRight, MousePointer2, CheckCircle2 } from 'lucide-react';
import { ContinuousTask } from '../types';

interface VirtualAppCanvasProps {
  appName: string;
  tasks: ContinuousTask[];
  activeTaskIndex: number;
  lastActionTarget: string;
  lastActionValue: string;
  cycleCount: number;
}

export const VirtualAppCanvas: React.FC<VirtualAppCanvasProps> = ({
  appName,
  tasks,
  activeTaskIndex,
  lastActionTarget,
  lastActionValue,
  cycleCount
}) => {
  return (
    <div className="bg-slate-950/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Virtual Browser Top Navigation Bar */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl mx-auto bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-300">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span className="text-slate-500">https://</span>
          <span className="text-cyan-400 font-semibold">{appName.toLowerCase().replace(/[^a-z0-9]/g, '')}.internal.app</span>
          <span className="text-slate-600">/operator/workspace</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">
          <ShieldCheck className="w-3 h-3" />
          <span>AI CONTROL GRANTED</span>
        </div>
      </div>

      {/* Screen Body */}
      <div className="p-5 flex-1 relative bg-gradient-to-b from-slate-900/40 to-slate-950 min-h-[300px]">
        {/* Dynamic AI Cursor Overlay */}
        <div className="absolute top-8 right-8 pointer-events-none transition-all duration-700 ease-out flex items-center gap-2 bg-cyan-950/90 border border-cyan-400 text-cyan-300 text-xs font-mono px-3 py-1.5 rounded-full shadow-lg shadow-cyan-500/20 animate-bounce">
          <MousePointer2 className="w-4 h-4 fill-cyan-400 text-cyan-950" />
          <span>AI Pointer: Targeting [{lastActionTarget || 'Workspace'}]</span>
        </div>

        {/* Content Inside Virtual Workspace */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{appName}</span>
                <span className="text-xs font-normal text-slate-400">• Automated Process Stream</span>
              </h3>
              <p className="text-xs text-slate-400">
                Operating autonomously in loop cycle #{cycleCount}
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400">
              Active Task: {tasks[activeTaskIndex]?.title || 'Processing pipeline'}
            </div>
          </div>

          {/* Active Work Flow Pipeline */}
          <div className="space-y-2">
            {tasks.map((task, idx) => {
              const isActive = idx === activeTaskIndex;
              return (
                <div
                  key={task.id || idx}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                      isActive ? 'bg-cyan-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <span>{task.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 rounded text-slate-300">
                          {task.actionType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        EXECUTING NOW
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        READY
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time payload monitor */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-slate-500 text-[10px] uppercase tracking-wider">Last Virtual DOM / API Event:</div>
            <div className="text-cyan-300">Target: <span className="text-white">{lastActionTarget || 'DOM Root'}</span></div>
            <div className="text-slate-400 truncate">Payload: <span className="text-amber-300">{lastActionValue || 'Autonomous heartbeat verified'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
