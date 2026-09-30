import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Download, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Cpu, 
  BrainCircuit, 
  Radio, 
  Layers, 
  ArrowRight, 
  Zap, 
  Info, 
  XCircle,
  ScanEye,
  Crosshair,
  Volume2,
  VolumeX,
  Grid,
  PackagePlus,
  Compass,
  Instagram,
  Youtube,
  MessageCircle,
  ShoppingBag,
  Coins
} from 'lucide-react';
import { MobileTapDot } from '../types';
import { generateAdbScript, generatePythonMobileMacroScript } from '../lib/mobileAdbGenerator';

export interface MobileAppItem {
  id: string;
  name: string;
  category: string;
  iconBg: string;
  iconEmoji: string;
  primaryActionLabel: string;
  taskDescription: string;
  hasAdPopup: boolean;
  packageUrl?: string;
}

export const MobileMacroStudio: React.FC = () => {
  // Mode: 'ai_vision' (Autonomous AI understanding screen) vs 'manual_dots' (Fixed Dots)
  const [controlMode, setControlMode] = useState<'ai_vision' | 'manual_dots'>('ai_vision');

  // Installed Mobile Apps List (User can add any new app!)
  const [mobileApps, setMobileApps] = useState<MobileAppItem[]>([
    {
      id: 'app-reward',
      name: 'Reward Miner',
      category: 'Crypto & Coins',
      iconBg: 'from-amber-500 to-orange-600',
      iconEmoji: '🪙',
      primaryActionLabel: 'CLAIM 500 COINS',
      taskDescription: 'Daily bonus claim karega aur beech me aane wale ad ko auto-skip karega.',
      hasAdPopup: true
    },
    {
      id: 'app-short-video',
      name: 'Viral Video App',
      category: 'Social Video',
      iconBg: 'from-rose-500 to-red-600',
      iconEmoji: '🎬',
      primaryActionLabel: 'AUTO-LIKE & NEXT',
      taskDescription: 'Video play karega, auto-like karega aur 5 second baad scroll karega.',
      hasAdPopup: false
    },
    {
      id: 'app-shopping',
      name: 'E-Commerce Store',
      category: 'Shopping & Offers',
      iconBg: 'from-blue-500 to-indigo-600',
      iconEmoji: '🛍️',
      primaryActionLabel: 'APPLY PROMO COUPON',
      taskDescription: 'Flash deal coupon apply karega aur checkout summary calculate karega.',
      hasAdPopup: true
    }
  ]);

  // Selected Active App on the Phone
  const [activeAppId, setActiveAppId] = useState<string>('app-reward');

  // State for Add New App Modal / Form
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState('Utility / Tools');
  const [newAppButtonLabel, setNewAppButtonLabel] = useState('EXECUTE WORK');
  const [newAppTaskNote, setNewAppTaskNote] = useState('');
  const [newAppHasAd, setNewAppHasAd] = useState(true);

  // Active App Object
  const currentApp = mobileApps.find(a => a.id === activeAppId) || mobileApps[0];

  // AI Vision Brain States
  const [aiScanPhase, setAiScanPhase] = useState<'idle' | 'scanning' | 'analyzing' | 'deciding' | 'tapping'>('idle');
  const [aiThought, setAiThought] = useState<string>('AI Screen Vision ready. App chunein aur "Start AI Autonomous Operator" dabayein.');
  const [detectedElement, setDetectedElement] = useState<{ name: string; confidence: number; x: number; y: number } | null>(null);

  // Voice narration toggle
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // App screen state inside the phone
  const [appScreenState, setAppScreenState] = useState<'home_grid' | 'inside_app' | 'popup_ad' | 'task_finished'>('inside_app');
  const [coinsBalance, setCoinsBalance] = useState(1250);

  // Tap dots list (Manual mode)
  const [dots, setDots] = useState<MobileTapDot[]>([
    {
      id: 'dot-1',
      order: 1,
      label: 'Open Selected App',
      xPercent: 28,
      yPercent: 32,
      action: 'tap',
      delayMs: 1500,
      repeatCount: 1,
      note: 'Launches target application'
    },
    {
      id: 'dot-2',
      order: 2,
      label: 'Tap Action Button',
      xPercent: 50,
      yPercent: 78,
      action: 'tap',
      delayMs: 2000,
      repeatCount: 1,
      note: 'Triggers action in app'
    },
    {
      id: 'dot-3',
      order: 3,
      label: 'Auto-Close / Skip Popup (X)',
      xPercent: 88,
      yPercent: 18,
      action: 'tap',
      delayMs: 1200,
      repeatCount: 1,
      note: 'Closes reward overlay / announcement'
    }
  ]);

  const [selectedDotId, setSelectedDotId] = useState<string | null>('dot-1');
  const [isPlacingMode, setIsPlacingMode] = useState(false);

  // Execution state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDotIndex, setActiveDotIndex] = useState<number | null>(null);
  const [executionLog, setExecutionLog] = useState<string[]>([
    'AutoTasker AI Mobile Vision Engine Loaded.',
    `Active Target Mobile App: "${currentApp.name}".`
  ]);

  const [activeTapVisual, setActiveTapVisual] = useState<{ x: number; y: number } | null>(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [scriptType, setScriptType] = useState<'adb' | 'python'>('adb');

  const phoneScreenRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const addLog = (msg: string) => {
    setExecutionLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 24)]);
  };

  // Add new Custom App Function
  const handleAddNewAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) {
      alert("App ka naam likhein!");
      return;
    }

    const emojis = ['🚀', '🎯', '💎', '🔥', '⚡', '📊', '🛠️', '🎮'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newApp: MobileAppItem = {
      id: `app-${Date.now()}`,
      name: newAppName.trim(),
      category: newAppCategory,
      iconBg: 'from-emerald-500 to-teal-700',
      iconEmoji: randomEmoji,
      primaryActionLabel: newAppButtonLabel.trim() || 'PERFORM AUTO TASK',
      taskDescription: newAppTaskNote.trim() || `Auto-task configured for ${newAppName}`,
      hasAdPopup: newAppHasAd
    };

    setMobileApps((prev) => [...prev, newApp]);
    setActiveAppId(newApp.id);
    setAppScreenState('inside_app');
    setShowAddAppModal(false);
    setNewAppName('');
    setNewAppTaskNote('');

    addLog(`New App Added: "${newApp.name}" (${newApp.category}). Screen loaded.`);
    speakText(`Naya app "${newApp.name}" add ho gaya hai aur mobile screen par open hai.`);
  };

  // Switch Active App
  const handleSelectApp = (appId: string) => {
    setActiveAppId(appId);
    setAppScreenState('inside_app');
    setAiScanPhase('idle');
    setDetectedElement(null);
    const target = mobileApps.find(a => a.id === appId);
    if (target) {
      setAiThought(`Active app switched to "${target.name}". Ready to auto-work.`);
      addLog(`Switched active app to "${target.name}".`);
      speakText(`${target.name} screen open ho gaya.`);
    }
  };

  // AI VISION AUTONOMOUS CYCLE
  const handleStartAiVisionAutomation = async () => {
    setIsPlaying(true);
    setAppScreenState('inside_app');
    speakText(`AI ab "${currentApp.name}" screen ko analyze karke kaam shuru kar raha hai...`);
    addLog(`=== AI Autonomous Vision Session on "${currentApp.name}" ===`);

    // Step 1: Scan Screen
    setAiScanPhase('scanning');
    setAiThought(`Vision Scanner: "${currentApp.name}" UI elements aur buttons detect kar raha hoon...`);
    addLog(`Vision: Inspecting screen resolution (1080x2400) for "${currentApp.name}"...`);
    await new Promise((r) => setTimeout(r, 1200));
    if (!isPlayingRef.current) return;

    // Step 2: Detect Main Action Button
    setAiScanPhase('analyzing');
    setDetectedElement({ name: currentApp.primaryActionLabel, confidence: 99.1, x: 50, y: 78 });
    setAiThought(`Target Button Mila: "${currentApp.primaryActionLabel}" (Confidence: 99.1%)`);
    addLog(`AI Decision: Main action button identified. Tapping coordinates (50%, 78%).`);
    await new Promise((r) => setTimeout(r, 1000));
    if (!isPlayingRef.current) return;

    // Step 3: Perform Tap on Main Button
    setAiScanPhase('tapping');
    setActiveTapVisual({ x: 50, y: 78 });
    speakText(`AI ne "${currentApp.primaryActionLabel}" par tap kiya.`);
    await new Promise((r) => setTimeout(r, 400));
    setActiveTapVisual(null);

    // If app has ad popup configured
    if (currentApp.hasAdPopup) {
      setAppScreenState('popup_ad');
      addLog("Screen Event: Popup ad/announcement overlay appeared on screen!");
      await new Promise((r) => setTimeout(r, 1000));
      if (!isPlayingRef.current) return;

      // Step 4: AI Recognizes the Popup & Searches for (X)
      setAiScanPhase('scanning');
      setAiThought("🚨 AI Alert: Screen par popup ad detect hua! Locating dismiss controls...");
      addLog("AI Vision: Unexpected modal/ad detected. Searching for (X) close icon...");
      await new Promise((r) => setTimeout(r, 1200));
      if (!isPlayingRef.current) return;

      // Step 5: Locate Close (X) Icon
      setAiScanPhase('deciding');
      setDetectedElement({ name: 'Close / Skip (X) Icon', confidence: 99.4, x: 88, y: 18 });
      setAiThought("Dismiss icon mila: Top-right corner (88%, 18%). Auto-skipping ad...");
      addLog("AI Decision: (X) Skip icon located at (88%, 18%). Executing dismiss tap.");
      speakText("Ad aayi hai. AI khud close button dhoondhkar skip kar raha hai.");
      await new Promise((r) => setTimeout(r, 1000));
      if (!isPlayingRef.current) return;

      // Step 6: Tap Close (X) to dismiss popup
      setAiScanPhase('tapping');
      setActiveTapVisual({ x: 88, y: 18 });
      await new Promise((r) => setTimeout(r, 400));
      setActiveTapVisual(null);
    }

    // Step 7: Final Task Complete
    setAppScreenState('task_finished');
    setCoinsBalance((c) => c + 500);
    addLog(`Success: Work completed on "${currentApp.name}"! Reward processed.`);
    speakText(`Shandar! "${currentApp.name}" me saara kaam poora ho gaya.`);

    await new Promise((r) => setTimeout(r, 1200));

    // Finish
    setAiScanPhase('idle');
    setDetectedElement(null);
    setIsPlaying(false);
    setAiThought(`Task finished on "${currentApp.name}". Ready for next task.`);
    addLog("=== AI Autonomous Decision Sequence Finished ===");
  };

  const handleStop = () => {
    setIsPlaying(false);
    setAiScanPhase('idle');
    setActiveDotIndex(null);
    setActiveTapVisual(null);
    addLog("Process stopped by user.");
  };

  const handleResetScreen = () => {
    setAppScreenState('inside_app');
    setAiScanPhase('idle');
    setDetectedElement(null);
    setAiThought(`Screen reset to "${currentApp.name}". Ready to auto-work.`);
    addLog(`Mobile screen reset to "${currentApp.name}".`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. App Selector & Add Custom App Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">
                📱
              </span>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Mobile Apps Library (Aapka Phone App Hub)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Kisi bhi app par click karein ya naya app add karein jisme AI se auto-work karwana hai:
            </p>
          </div>

          <button
            onClick={() => setShowAddAppModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <PackagePlus className="w-4 h-4" />
            <span>+ NAYA APP ADD KAREIN</span>
          </button>
        </div>

        {/* Apps Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
          {mobileApps.map((app) => {
            const isActive = app.id === activeAppId;
            return (
              <button
                key={app.id}
                onClick={() => handleSelectApp(app.id)}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isActive
                    ? 'bg-purple-950/40 border-purple-400 ring-2 ring-purple-400/40 shadow-lg scale-[1.01]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center text-lg shrink-0 shadow`}>
                  {app.iconEmoji}
                </div>
                <div className="truncate flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{app.name}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                  </div>
                  <div className="text-[10px] text-purple-300 font-mono">{app.category}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{app.primaryActionLabel}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. AI Brain & Vision Control Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
              <BrainCircuit className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  AUTONOMOUS AI MOBILE OPERATOR (AI खुद स्क्रीन समझकर चलाएगा)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950 font-mono">
                  COMPUTER VISION + OCR
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                App chunein aur <strong>START AI AUTONOMOUS OPERATOR</strong> dabayein. AI khud screen par buttons, task progress aur ads pehchanega!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 ${
                voiceEnabled ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800' : 'text-slate-500 bg-slate-950'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{voiceEnabled ? 'Hindi Voice ON' : 'Mute Voice'}</span>
            </button>
          </div>
        </div>

        {/* AI Thought Live Radar Bar */}
        <div className="p-3 rounded-xl bg-slate-950/90 border border-purple-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping shrink-0" />
            <span className="text-purple-300 font-mono font-bold shrink-0">AI Brain:</span>
            <span className="text-white font-sans text-xs truncate">{aiThought}</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 shrink-0">
            Active App: {currentApp.name}
          </span>
        </div>
      </div>

      {/* 3. Main Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Virtual Phone with Real-time AI Vision Overlay */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[320px] bg-slate-950 rounded-[44px] p-3.5 border-4 border-slate-700 shadow-2xl relative select-none ring-1 ring-slate-600">
            {/* Phone Top Notch */}
            <div className="w-28 h-5 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <span className="w-2 h-2 rounded-full bg-cyan-900/60" />
            </div>

            {/* Screen Viewport with Vision Scan Overlay */}
            <div
              ref={phoneScreenRef}
              className="w-full aspect-[9/18.5] rounded-[32px] overflow-hidden relative border border-slate-800 bg-gradient-to-b from-indigo-950 via-slate-900 to-black flex flex-col justify-between p-3.5 transition-all"
            >
              {/* Status Bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono pt-1 px-2 shrink-0">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">🪙 {coinsBalance}</span>
                  <span>5G 🔋</span>
                </div>
              </div>

              {/* Simulated Mobile App UI */}
              <div className="flex-1 flex flex-col justify-between py-4 space-y-4">
                {/* App Top Header */}
                <div className="bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentApp.iconBg} flex items-center justify-center text-sm font-bold text-white shadow`}>
                      {currentApp.iconEmoji}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">{currentApp.name}</div>
                      <div className="text-[9px] text-emerald-400 font-mono">{currentApp.category}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                    OPEN
                  </span>
                </div>

                {/* Content Area */}
                {appScreenState === 'task_finished' ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-2 animate-fade-in">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white text-sm">Work Completed!</h4>
                    <p className="text-[11px] text-slate-300">
                      Task executed successfully in {currentApp.name}.
                    </p>
                    <button
                      onClick={handleResetScreen}
                      className="px-3 py-1 bg-slate-900 border border-slate-700 text-xs rounded-lg text-slate-300 hover:text-white"
                    >
                      Reset Screen
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white">Active App Task</span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">+500 PTS</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      {currentApp.taskDescription}
                    </p>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                    </div>
                  </div>
                )}

                {/* Main Action Button */}
                <div 
                  id="target-claim-button"
                  className="py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs text-center shadow-lg shadow-purple-600/30 font-sans"
                >
                  {currentApp.primaryActionLabel}
                </div>
              </div>

              {/* Popup / Ad Overlay (Shows when button tapped if configured) */}
              {appScreenState === 'popup_ad' && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center animate-fade-in z-30">
                  <div className="w-full bg-slate-900 border border-purple-500/50 rounded-2xl p-4 relative space-y-2 shadow-2xl">
                    {/* Simulated Close (X) icon on top right */}
                    <div className="absolute top-2.5 right-2.5 p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-sm font-bold text-white">🚨 Commercial Ad Modal</div>
                    <p className="text-[10px] text-slate-400">
                      AI is inspecting this modal to identify the Skip / Close (X) button automatically.
                    </p>
                    <div className="text-[9px] text-purple-300 font-mono bg-purple-950 p-1.5 rounded border border-purple-800">
                      [DETECTED: DISMISS BUTTON AT TOP RIGHT]
                    </div>
                  </div>
                </div>
              )}

              {/* AI COMPUTER VISION SCANNER LASER (Scanning Animation) */}
              {aiScanPhase === 'scanning' && (
                <div className="absolute inset-0 pointer-events-none z-40 bg-purple-500/5 overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse" 
                       style={{ animation: 'bounce 1.5s infinite' }} />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 border border-cyan-500/50 flex items-center gap-1">
                    <ScanEye className="w-3 h-3 animate-spin" />
                    <span>AI VISION SCANNING...</span>
                  </div>
                </div>
              )}

              {/* AI DETECTED BOUNDING BOX */}
              {detectedElement && (
                <div
                  style={{
                    left: `${detectedElement.x}%`,
                    top: `${detectedElement.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute pointer-events-none z-40 border-2 border-dashed border-cyan-400 bg-cyan-400/10 rounded-xl p-6 flex flex-col items-center justify-center animate-fade-in"
                >
                  <span className="bg-slate-950 text-cyan-300 font-mono text-[8px] px-1.5 py-0.5 rounded border border-cyan-400 absolute -top-4 font-bold whitespace-nowrap shadow">
                    AI FOUND: {detectedElement.name} ({detectedElement.confidence}%)
                  </span>
                </div>
              )}

              {/* Active Tap Ripple */}
              {activeTapVisual && (
                <div
                  style={{
                    left: `${activeTapVisual.x}%`,
                    top: `${activeTapVisual.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute pointer-events-none z-50"
                >
                  <span className="w-14 h-14 rounded-full border-2 border-emerald-400 animate-ping absolute -inset-7 inline-block" />
                  <span className="w-7 h-7 rounded-full bg-emerald-400/80 inline-block animate-pulse shadow-lg shadow-emerald-400/50" />
                </div>
              )}

              {/* Phone Home Bar */}
              <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-2 shrink-0" />
            </div>

            <p className="text-[10px] text-slate-500 text-center mt-2.5 font-mono">
              Virtual Android Resolution: 1080 × 2400 (Active Screen)
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): AI Vision Brain Controls & Decision Logs */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Action Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  <span>Target App: {currentApp.name}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  AI reads buttons, text labels, and detects pop-ups automatically without manual inputs.
                </p>
              </div>

              <button
                onClick={handleResetScreen}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Screen</span>
              </button>
            </div>

            {/* Big Action Button */}
            <div className="flex flex-wrap items-center gap-3">
              {isPlaying ? (
                <button
                  onClick={handleStop}
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
                >
                  <Pause className="w-4 h-4" />
                  <span>STOP AI OPERATOR (रोकें)</span>
                </button>
              ) : (
                <button
                  onClick={handleStartAiVisionAutomation}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-black font-mono text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>START AI AUTONOMOUS OPERATOR ({currentApp.name.toUpperCase()} में काम शुरू करो)</span>
                </button>
              )}

              <button
                onClick={() => setShowScriptModal(true)}
                className="px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>Real Phone Code</span>
              </button>
            </div>
          </div>

          {/* AI Decision Pipeline View */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl font-mono text-xs">
            <div className="font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>AI Decision Matrix (How AI Thinks on Mobile Screen)</span>
            </div>

            <div className="space-y-2">
              <div className={`p-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                aiScanPhase === 'scanning' ? 'bg-cyan-950/60 border-cyan-400 shadow' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="w-6 h-6 rounded-full bg-cyan-900/60 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-white">Visual OCR & Element Detection:</div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Screen ke text aur buttons ko scan karke "{currentApp.primaryActionLabel}" identify karta hai.
                  </div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                aiScanPhase === 'analyzing' || aiScanPhase === 'deciding' ? 'bg-purple-950/60 border-purple-400 shadow' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="w-6 h-6 rounded-full bg-purple-900/60 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-white">Ad & Popup Recognition:</div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Agar beech me koi ad ya announcement aati hai, AI top-corners me (X) ya "Skip" icon dhoondhta hai.
                  </div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                aiScanPhase === 'tapping' ? 'bg-emerald-950/60 border-emerald-400 shadow' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-white">Autonomous Tap Dispatch:</div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Bina kisi insaan ke click kiye, AI khud screen coordinates par tap event bhejkar kaam poora karta hai.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Action Logs Console */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 h-[190px] flex flex-col">
            <div className="text-[11px] text-slate-400 font-bold flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>AI Perception & Execution Logs:</span>
              </span>
              <span className="text-[10px] text-cyan-400">{executionLog.length} events logged</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
              {executionLog.map((log, i) => (
                <div key={i} className="text-slate-300 leading-relaxed font-mono">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL: Naya App Add Karne Ka Form */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Naya Mobile App Add Karein</h3>
              </div>
              <button
                onClick={() => setShowAddAppModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewAppSubmit} className="space-y-3.5 text-xs">
              {/* App Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 font-bold">App Ka Naam *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Crypto App, Game Booster, Flipkart"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 font-bold">Category</label>
                <select
                  value={newAppCategory}
                  onChange={(e) => setNewAppCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="Reward & Task">Reward & Task App</option>
                  <option value="Crypto & Web3">Crypto & Web3 Mining</option>
                  <option value="Social & Video">Social Media / Video Feed</option>
                  <option value="Shopping & Deals">Shopping & Coupons</option>
                  <option value="Gaming & Utility">Gaming & Utility</option>
                </select>
              </div>

              {/* Primary Action Button Text */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 font-bold">
                  App Me Main Button Ka Naam (Jis Par Click Karwana Hai) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CLAIM BONUS, START AUTO WORK, APPLY CODE"
                  value={newAppButtonLabel}
                  onChange={(e) => setNewAppButtonLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Task Note */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 font-bold">
                  AI Ko Kya Kaam Karna Hai? (Instruction Note)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Button dabakar daily points claim karo aur agar ad aaye toh skip karo"
                  value={newAppTaskNote}
                  onChange={(e) => setNewAppTaskNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              {/* Checkbox: Does it have ads? */}
              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  checked={newAppHasAd}
                  onChange={(e) => setNewAppHasAd(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300">
                  Is app me pop-up ad aati hai? (AI automatically (X) dhoondhkar skip karega)
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAppModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg"
                >
                  App Add Karein & Mobile Screen Par Load Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real Phone Script Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>Real Phone AI Vision & Auto-Clicker Script</span>
                </h3>
                <p className="text-xs text-slate-400">
                  USB cable se phone connect karke yeh script direct screen par automated taps chalayega.
                </p>
              </div>
              <button
                onClick={() => setShowScriptModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScriptType('adb')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    scriptType === 'adb' ? 'bg-purple-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Shell / ADB (.sh / .bat)
                </button>
                <button
                  onClick={() => setScriptType('python')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    scriptType === 'python' ? 'bg-purple-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Python Auto-Clicker
                </button>
              </div>

              <button
                onClick={() => {
                  const code = scriptType === 'adb' ? generateAdbScript(dots) : generatePythonMobileMacroScript(dots);
                  navigator.clipboard.writeText(code);
                  alert("Script copied to clipboard!");
                }}
                className="px-3 py-1 rounded-lg bg-purple-500 text-slate-950 font-bold"
              >
                COPY CODE
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-purple-200">
              <pre className="whitespace-pre-wrap break-all">
                {scriptType === 'adb' ? generateAdbScript(dots) : generatePythonMobileMacroScript(dots)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMacroStudio;
