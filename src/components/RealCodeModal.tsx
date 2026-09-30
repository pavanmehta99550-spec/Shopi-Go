import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { AutomationRecipe } from '../types';
import { generatePlaywrightScript, generatePythonScript } from '../lib/automationEngine';

interface RealCodeModalProps {
  recipe: AutomationRecipe;
  onClose: () => void;
}

export const RealCodeModal: React.FC<RealCodeModalProps> = ({ recipe, onClose }) => {
  const [activeTab, setActiveTab] = useState<'playwright' | 'python'>('playwright');
  const [copied, setCopied] = useState(false);

  const playwrightCode = generatePlaywrightScript(recipe);
  const pythonCode = generatePythonScript(recipe);
  const activeCode = activeTab === 'playwright' ? playwrightCode : pythonCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const filename = activeTab === 'playwright' ? 'autotask.js' : 'autotask.py';
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Real Autonomous Script Code</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                  100% EXECUTABLE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Is code ko apne laptop par Node.js ya Python me run karke real Chrome control kar sakte hain.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Action Buttons */}
        <div className="px-4 sm:px-5 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('playwright')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'playwright'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Node.js / Playwright
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'python'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Python / Selenium
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD FILE</span>
            </button>
          </div>
        </div>

        {/* Code Body */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed select-all">
          <pre className="whitespace-pre-wrap break-all">{activeCode}</pre>
        </div>

        {/* Instructions Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            {activeTab === 'playwright'
              ? 'Run command: npm install playwright && node autotask.js'
              : 'Run command: pip install selenium webdriver-manager && python autotask.py'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealCodeModal;
