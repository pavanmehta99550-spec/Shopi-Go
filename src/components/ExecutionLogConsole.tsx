import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { ExecutionLog } from '../types';

interface ExecutionLogConsoleProps {
  logs: ExecutionLog[];
  onClearLogs: () => void;
}

export const ExecutionLogConsole: React.FC<ExecutionLogConsoleProps> = ({ logs, onClearLogs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2.5 shadow-xl font-mono text-xs flex flex-col h-[230px]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Autonomous Agent Logs</span>
        </div>
        <button
          onClick={onClearLogs}
          className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic py-4 text-center">
            Waiting for automation trigger...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
              <span
                className={`font-semibold shrink-0 uppercase text-[9px] px-1 py-0.2 rounded border ${
                  log.type === 'action'
                    ? 'text-cyan-400 border-cyan-800/80 bg-cyan-950/40'
                    : log.type === 'ai_thought'
                    ? 'text-purple-400 border-purple-800/80 bg-purple-950/40'
                    : log.type === 'success'
                    ? 'text-emerald-400 border-emerald-800/80 bg-emerald-950/40'
                    : log.type === 'warning'
                    ? 'text-amber-400 border-amber-800/80 bg-amber-950/40'
                    : 'text-slate-400 border-slate-800 bg-slate-900'
                }`}
              >
                {log.type}
              </span>
              <span
                className={`break-all ${
                  log.type === 'success'
                    ? 'text-emerald-300 font-bold'
                    : log.type === 'action'
                    ? 'text-cyan-200'
                    : log.type === 'ai_thought'
                    ? 'text-slate-300'
                    : 'text-slate-400'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExecutionLogConsole;
