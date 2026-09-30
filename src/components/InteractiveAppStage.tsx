import React from 'react';
import { 
  MousePointer2, 
  Sparkles, 
  ExternalLink, 
  Maximize2, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { AutomationStep, SupportedAppId } from '../types';
import WhatsAppSimulator from './simulators/WhatsAppSimulator';
import YouTubeSimulator from './simulators/YouTubeSimulator';
import SheetsSimulator from './simulators/SheetsSimulator';
import FormsSimulator from './simulators/FormsSimulator';
import CustomBrowserSimulator from './simulators/CustomBrowserSimulator';

interface InteractiveAppStageProps {
  appId: SupportedAppId;
  appName: string;
  appUrl: string;
  currentStep: AutomationStep | null;
  stepProgress: number;
  cursorPos: { x: number; y: number };
  isClicking: boolean;
  status: string;
}

export const InteractiveAppStage: React.FC<InteractiveAppStageProps> = ({
  appId,
  appName,
  appUrl,
  currentStep,
  stepProgress,
  cursorPos,
  isClicking,
  status
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
      {/* Top Browser Window Header */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-300 ml-2">
            AutoTasker Virtual Viewport
          </span>
        </div>

        {/* URL Pill */}
        <div className="flex-1 max-w-md bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-300">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-500">https://</span>
          <span className="text-cyan-400 font-semibold truncate">{appUrl.replace(/^https?:\/\//, '')}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 ${
            status === 'running' 
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700 animate-pulse'
              : status === 'completed'
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-700'
              : 'bg-slate-800 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              status === 'running' ? 'bg-emerald-400 animate-ping' : status === 'completed' ? 'bg-cyan-400' : 'bg-slate-500'
            }`} />
            <span>{status.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* Main Viewport Container with Cursor Overlay */}
      <div className="relative flex-1 min-h-[380px] p-3 overflow-hidden bg-slate-950/70 flex flex-col">
        {/* Render Specific App Simulator */}
        {appId === 'whatsapp' && (
          <WhatsAppSimulator currentStep={currentStep} stepProgress={stepProgress} />
        )}
        {appId === 'youtube' && (
          <YouTubeSimulator currentStep={currentStep} stepProgress={stepProgress} />
        )}
        {appId === 'sheets' && (
          <SheetsSimulator currentStep={currentStep} stepProgress={stepProgress} />
        )}
        {appId === 'forms' && (
          <FormsSimulator currentStep={currentStep} stepProgress={stepProgress} />
        )}
        {(appId === 'custom' || appId === 'instagram') && (
          <CustomBrowserSimulator
            appName={appName}
            appUrl={appUrl}
            currentStep={currentStep}
            stepProgress={stepProgress}
          />
        )}

        {/* Autonomous AI Cursor Pointer (Moves smoothly across the screen) */}
        {status === 'running' && (
          <div
            className="absolute pointer-events-none transition-all duration-500 ease-out z-50 flex items-start gap-1"
            style={{
              top: `${cursorPos.y}%`,
              left: `${cursorPos.x}%`,
              transform: 'translate(-8px, -8px)'
            }}
          >
            {/* The Mouse Pointer Arrow */}
            <div className={`relative transition-transform duration-150 ${isClicking ? 'scale-75 translate-y-0.5' : 'scale-100'}`}>
              <MousePointer2 className="w-6 h-6 text-cyan-300 fill-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              {isClicking && (
                <span className="absolute -top-2 -left-2 w-10 h-10 rounded-full border-2 border-cyan-300 animate-ping opacity-75" />
              )}
            </div>

            {/* AI Action Label beside mouse */}
            <div className="bg-slate-950/95 border border-cyan-400 text-cyan-300 font-mono text-[10px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
              <span className="font-bold">AI Agent:</span> {currentStep?.actionType || 'OPERATING'}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live Action Bar */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-400">Target Element:</span>
          <span className="text-cyan-300 font-semibold truncate">
            {currentStep?.targetSelector || 'Idle / Ready'}
          </span>
        </div>

        {currentStep?.paramValue && (
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px] truncate max-w-xs">
            <span>Payload:</span>
            <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-900 truncate">
              "{currentStep.paramValue}"
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveAppStage;
