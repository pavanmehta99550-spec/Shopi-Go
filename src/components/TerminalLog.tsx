import React, { useRef, useEffect } from 'react';
import { Terminal, Download, Trash2, Cpu } from 'lucide-react';
import { ExecutionLogItem } from '../types';

interface TerminalLogProps {
  logs: ExecutionLogItem[];
  onClear: () => void;
  latestThought?: string;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs, onClear, latestThought }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleDownloadLogs = () => {
    const textContent = logs.map(l => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-execution-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 flex flex-col h-[340px] shadow-xl overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>AUTONOMOUS STREAM LOG</span>
          <span className="text-slate-500">({logs.length} entries)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadLogs}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Download Log File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClear}
            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
            title="Clear Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chain-of-Thought Banner */}
      {latestThought && (
        <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-900/50 flex items-start gap-2.5 text-xs font-mono">
          <Cpu className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-indigo-400 font-bold uppercase tracking-wider mr-2">Agent Thought:</span>
            <span className="text-indigo-200">{latestThought}</span>
          </div>
        </div>
      )}

      {/* Log Output Stream */}
      <div ref={scrollRef} className="flex-1 p-3.5 overflow-y-auto space-y-1.5 font-mono text-xs select-text">
        {logs.map((log) => {
          let badgeColor = 'text-slate-400';
          if (log.type === 'action') badgeColor = 'text-cyan-400 font-bold';
          if (log.type === 'ai_thought') badgeColor = 'text-purple-400';
          if (log.type === 'user_override') badgeColor = 'text-amber-400 font-bold';
          if (log.type === 'stop') badgeColor = 'text-rose-400 font-bold';

          return (
            <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/50 px-1.5 py-0.5 rounded leading-relaxed">
              <span className="text-slate-600 select-none shrink-0">[{log.timestamp}]</span>
              <span className={`shrink-0 uppercase text-[10px] px-1 rounded bg-slate-900 border border-slate-800 ${badgeColor}`}>
                {log.type}
              </span>
              <span className="text-slate-300 break-words flex-1">
                {log.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
