import React, { useEffect, useState } from 'react';
import { Table, Plus, Download, Check, Sparkles, Filter, Calculator } from 'lucide-react';
import { AutomationStep } from '../../types';

interface SheetsSimulatorProps {
  currentStep: AutomationStep | null;
  stepProgress: number;
}

interface SheetRow {
  id: number;
  name: string;
  category: string;
  amount: number;
  status: 'Confirmed' | 'Paid' | 'Pending';
}

export const SheetsSimulator: React.FC<SheetsSimulatorProps> = ({ currentStep, stepProgress }) => {
  const [rows, setRows] = useState<SheetRow[]>([
    { id: 1, name: 'Pavan Mehta', category: 'Hardware Engine', amount: 25000, status: 'Confirmed' }
  ]);

  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    if (!currentStep) return;

    if (currentStep.id === 's-4') {
      setRows((prev) => {
        if (prev.find(r => r.id === 2)) return prev;
        return [...prev, { id: 2, name: 'Rajesh Kumar', category: 'Software Dev', amount: 18500, status: 'Paid' }];
      });
    }

    if (currentStep.id === 's-5') {
      setRows((prev) => {
        if (prev.find(r => r.id === 3)) return prev;
        return [...prev, { id: 3, name: 'Amit Verma', category: 'Cloud Infrastructure', amount: 32000, status: 'Pending' }];
      });
    }

    if (currentStep.id === 's-6' || currentStep.actionType === 'VERIFY') {
      setHasCalculated(true);
    }
  }, [currentStep]);

  const totalAmount = rows.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="w-full h-full flex flex-col bg-[#1e293b] text-slate-100 rounded-xl overflow-hidden border border-emerald-800/40 font-mono select-none text-xs">
      {/* Top Google Sheets Menu Bar */}
      <div className="bg-[#0f172a] px-3.5 py-2 border-b border-slate-700 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
            <Table className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              <span>AutoTask_Ledger_2026</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 rounded border border-emerald-800">
                LIVE CLOUD SYNC
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-sans flex items-center gap-2">
              <span>File</span> <span>Edit</span> <span>View</span> <span>Insert</span> <span>Format</span> <span>Data</span>
            </div>
          </div>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded border border-slate-700 text-[11px] text-slate-300">
          <span className="text-emerald-400 font-bold">fx</span>
          <span className="text-slate-400">|</span>
          <span className="text-cyan-300">{hasCalculated ? '=SUM(D2:D4)' : '=AUTORPA_FEED()'}</span>
        </div>
      </div>

      {/* Spreadsheet Grid Table */}
      <div className="flex-1 overflow-x-auto p-2 bg-[#090d16]">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-800/90 text-slate-300 text-[11px]">
              <th className="p-2 border border-slate-700 w-10 text-center">#</th>
              <th className="p-2 border border-slate-700">A: Client Name</th>
              <th className="p-2 border border-slate-700">B: Project Category</th>
              <th className="p-2 border border-slate-700 text-right">C: Amount (INR)</th>
              <th className="p-2 border border-slate-700 text-center">D: Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr 
                key={r.id} 
                className={`transition-colors ${
                  idx === rows.length - 1 ? 'bg-emerald-950/20' : 'hover:bg-slate-800/30'
                }`}
              >
                <td className="p-2 border border-slate-700/80 text-center text-slate-500 bg-slate-900/50 font-mono">
                  {r.id}
                </td>
                <td className="p-2 border border-slate-700/80 font-medium text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{r.name}</span>
                </td>
                <td className="p-2 border border-slate-700/80 text-slate-300">
                  {r.category}
                </td>
                <td className="p-2 border border-slate-700/80 text-right font-mono text-emerald-400 font-bold">
                  ₹{r.amount.toLocaleString('en-IN')}
                </td>
                <td className="p-2 border border-slate-700/80 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.status === 'Paid' 
                      ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                      : r.status === 'Confirmed'
                      ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700'
                      : 'bg-amber-900/80 text-amber-300 border border-amber-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}

            {/* Empty filler rows */}
            {[1, 2].map((n) => (
              <tr key={`empty-${n}`} className="opacity-40">
                <td className="p-2 border border-slate-700/80 text-center text-slate-600 bg-slate-900/50">
                  {rows.length + n}
                </td>
                <td className="p-2 border border-slate-700/80 text-slate-600 italic">-- Empty Cell --</td>
                <td className="p-2 border border-slate-700/80 text-slate-600">--</td>
                <td className="p-2 border border-slate-700/80 text-right text-slate-600">--</td>
                <td className="p-2 border border-slate-700/80 text-center text-slate-600">--</td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="bg-slate-900 font-bold border-t-2 border-emerald-500">
              <td className="p-2 border border-slate-700 text-center text-emerald-400">∑</td>
              <td className="p-2 border border-slate-700 text-white font-bold" colSpan={2}>
                TOTAL BALANCE (CALCULATED BY AI)
              </td>
              <td className="p-2 border border-slate-700 text-right text-emerald-400 text-sm font-mono font-black">
                ₹{totalAmount.toLocaleString('en-IN')}
              </td>
              <td className="p-2 border border-slate-700 text-center text-emerald-400 text-[10px]">
                {hasCalculated ? 'VERIFIED ✓' : 'PROCESSING'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SheetsSimulator;
