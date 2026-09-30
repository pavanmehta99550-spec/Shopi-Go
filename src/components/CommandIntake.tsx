import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Globe, 
  MessageSquare, 
  Youtube, 
  Table, 
  FileText,
  Zap,
  Code2
} from 'lucide-react';
import { SupportedAppId, AppTemplate } from '../types';

interface CommandIntakeProps {
  selectedAppId: SupportedAppId;
  onSelectApp: (appId: SupportedAppId) => void;
  appName: string;
  setAppName: (name: string) => void;
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  onStartAutomation: () => void;
  onPauseAutomation: () => void;
  onStopAutomation: () => void;
  onOpenCodeModal: () => void;
  agentStatus: string;
  executionSpeed: '1x' | '2x' | 'turbo';
  setExecutionSpeed: (speed: '1x' | '2x' | 'turbo') => void;
  voiceVoiceEnabled: boolean;
  setVoiceVoiceEnabled: (enabled: boolean) => void;
}

const APPS: Array<{ id: SupportedAppId; name: string; icon: React.ReactNode; color: string; sample: string }> = [
  { 
    id: 'whatsapp', 
    name: 'WhatsApp Web', 
    icon: <MessageSquare className="w-4 h-4 text-emerald-400" />, 
    color: 'border-emerald-500/50 hover:bg-emerald-950/30',
    sample: 'Papa ko Good Morning aur order details ka message auto-send karo'
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: <Youtube className="w-4 h-4 text-red-500" />, 
    color: 'border-red-500/50 hover:bg-red-950/30',
    sample: 'Trending songs search karke first video auto play aur like karo'
  },
  { 
    id: 'sheets', 
    name: 'Google Sheets', 
    icon: <Table className="w-4 h-4 text-emerald-400" />, 
    color: 'border-emerald-500/50 hover:bg-emerald-950/30',
    sample: 'Clients ka name aur revenue amount enter karke total calculate karo'
  },
  { 
    id: 'forms', 
    name: 'Web Form', 
    icon: <FileText className="w-4 h-4 text-blue-400" />, 
    color: 'border-blue-500/50 hover:bg-blue-950/30',
    sample: 'Name, email aur details bharkar registration form submit karo'
  },
  { 
    id: 'custom', 
    name: 'Any Site / URL', 
    icon: <Globe className="w-4 h-4 text-cyan-400" />, 
    color: 'border-cyan-500/50 hover:bg-cyan-950/30',
    sample: 'Flipkart par iPhone 15 search karke price check karo'
  }
];

export const CommandIntake: React.FC<CommandIntakeProps> = ({
  selectedAppId,
  onSelectApp,
  appName,
  setAppName,
  userPrompt,
  setUserPrompt,
  onStartAutomation,
  onPauseAutomation,
  onStopAutomation,
  onOpenCodeModal,
  agentStatus,
  executionSpeed,
  setExecutionSpeed,
  voiceVoiceEnabled,
  setVoiceVoiceEnabled
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [speechError, setSpeechError] = useState('');

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setRecognitionSupported(true);
      }
    }
  }, []);

  const toggleVoiceListening = () => {
    if (!recognitionSupported) {
      alert("Aapke browser me voice recognition support nahi mila. Please Chrome use karein ya text likhein.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Hindi & Hinglish
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setSpeechError('');

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserPrompt(transcript);
      setIsListening(false);
    };

    recognition.onerror = (err: any) => {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
      setSpeechError('Awaaz clear nahi aayi, please dubara try karein ya likhkar batayein.');
      setTimeout(() => setSpeechError(''), 4000);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl font-sans">
      {/* 1. App Selection Header */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">1</span>
            <span>Target App / Website Chunein:</span>
          </span>
          <span className="text-[11px] text-cyan-400">5 Pre-Integrated Apps + Custom URL</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                onSelectApp(app.id);
                setAppName(app.name);
                setUserPrompt(app.sample);
              }}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                selectedAppId === app.id
                  ? 'bg-slate-800 border-cyan-400 text-white ring-1 ring-cyan-400 shadow-md scale-[1.02]'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-1 rounded-md bg-slate-900 border border-slate-700/60">
                  {app.icon}
                </span>
                {selectedAppId === app.id && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
              <div className="mt-2">
                <div className="font-bold text-xs">{app.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">Click to load</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Custom App Name or URL Input (if custom chosen) */}
      {selectedAppId === 'custom' && (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400">Custom App Name ya Website URL:</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. Flipkart, Amazon, Gmail, https://my-erp.internal"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>
      )}

      {/* 3. Voice & Text Instructions Intake */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">2</span>
            <span>App Me Kya-Kya Karwana Hai? (Voice ya Text Me Batayein):</span>
          </label>

          {/* Voice Output Toggle */}
          <button
            onClick={() => setVoiceVoiceEnabled(!voiceVoiceEnabled)}
            className={`text-[11px] font-mono flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              voiceVoiceEnabled ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {voiceVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceVoiceEnabled ? 'Hindi Voice ON' : 'Voice Mute'}</span>
          </button>
        </div>

        {/* Text Area with Mic Integration */}
        <div className="relative">
          <textarea
            rows={2}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Yahan type karein ya neeche Mic dabakar bolkar batayein... (e.g. 'YouTube par jao aur trending songs search karke first video play karo')"
            className="w-full p-3.5 pr-28 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed font-sans resize-none"
          />

          {/* Voice Input Mic Button */}
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleVoiceListening}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-mono transition-all shadow-md ${
                isListening
                  ? 'bg-red-500 border-red-300 text-white animate-pulse ring-4 ring-red-500/40'
                  : 'bg-slate-900 border-slate-700 text-cyan-300 hover:bg-slate-800 hover:border-cyan-400'
              }`}
              title="Mic dabakar Hindi ya English me boleie"
            >
              {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
              <span className="hidden sm:inline font-bold">
                {isListening ? 'Sun Raha Hai...' : 'Bolkar Batayein'}
              </span>
            </button>
          </div>
        </div>

        {speechError && (
          <div className="text-[11px] text-amber-400 font-mono">
            {speechError}
          </div>
        )}
      </div>

      {/* 4. Action Controls & Speed Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Speed Selector */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Speed:</span>
          {(['1x', '2x', 'turbo'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setExecutionSpeed(s)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${
                executionSpeed === s
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Master Execution Buttons */}
        <div className="flex items-center gap-2">
          {/* Export Code Button */}
          <button
            onClick={onOpenCodeModal}
            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Real Script Code</span>
          </button>

          {agentStatus === 'running' ? (
            <>
              <button
                onClick={onPauseAutomation}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>

              <button
                onClick={onStopAutomation}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg transition-all"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </button>
            </>
          ) : (
            <button
              onClick={onStartAutomation}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black font-mono text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>START AUTO WORK (काम शुरू करो)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandIntake;
