import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Sparkles, 
  Play, 
  Pickaxe, 
  TrendingUp, 
  MessageSquareShare, 
  Globe, 
  Cpu, 
  ArrowRight,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { APP_TEMPLATES } from '../data/appTemplates';
import { TargetAppTemplate } from '../types';

interface AppIntakeModalProps {
  onStartAgent: (appName: string, userGoal: string, template?: TargetAppTemplate) => void;
  isLoading: boolean;
}

export const AppIntakeModal: React.FC<AppIntakeModalProps> = ({ onStartAgent, isLoading }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TargetAppTemplate>(APP_TEMPLATES[0]);
  const [customAppName, setCustomAppName] = useState('');
  const [userGoal, setUserGoal] = useState(APP_TEMPLATES[0].suggestedPrompt);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Initialize Web Speech API for voice input
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  const handleToggleListening = () => {
    if (!speechSupported) {
      alert("Aapka browser speech recognition support nahi karta. Kripya type karein.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Supports Hindi & English spoken
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserGoal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
    }
  };

  const handleSelectTemplate = (template: TargetAppTemplate) => {
    setSelectedTemplate(template);
    if (template.id !== 'custom_any_app') {
      setUserGoal(template.suggestedPrompt);
      setCustomAppName('');
    } else {
      setUserGoal('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveAppName = customAppName.trim() || selectedTemplate.name;
    if (!userGoal.trim()) {
      alert("Kripya AI ko bataiye ki use is app me kya kaam karna hai!");
      return;
    }
    onStartAgent(effectiveAppName, userGoal, selectedTemplate);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pickaxe': return <Pickaxe className="w-5 h-5 text-amber-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'MessageSquareShare': return <MessageSquareShare className="w-5 h-5 text-cyan-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-blue-400" />;
      default: return <Cpu className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* AI Assistant Question Box */}
      <div className="relative mb-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 md:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 overflow-hidden">
        {/* Decorative cyber grid backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/20">
            <Bot className="w-9 h-9 animate-pulse" />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-[11px] font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI ASSISTANT IS READY TO OPERATE</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              &ldquo;Aap kaunsi app chalu karna chahte hain, aur usme mujhse kya karwana hai?&rdquo;
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bas mujhe bataiye—main aapka objective samajh kar <strong className="text-cyan-400">continuous automated loop</strong> me tab tak work karta rahunga jab tak aap <strong className="text-rose-400">STOP</strong> na karein!
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select or Type App */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-900/50 text-cyan-400 flex items-center justify-center text-xs font-bold">1</span>
            Target App / System Select Karein:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {APP_TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate.id === tpl.id;
              return (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                      {renderIcon(tpl.icon)}
                    </div>
                    <div className="font-semibold text-sm text-white">{tpl.name}</div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Custom App Name Input if Custom or desired */}
          {selectedTemplate.id === 'custom_any_app' && (
            <div className="mt-3">
              <input
                type="text"
                value={customAppName}
                onChange={(e) => setCustomAppName(e.target.value)}
                placeholder="Example: WhatsApp Web, Instagram, Binance, My Custom API..."
                className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}
        </div>

        {/* Step 2: Goal Instructions with Voice Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-900/50 text-cyan-400 flex items-center justify-center text-xs font-bold">2</span>
              Aapko Is App Me Kya Kaam Karwana Hai? (Bol kar ya likh kar batayein):
            </label>

            {speechSupported && (
              <button
                type="button"
                onClick={handleToggleListening}
                className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{isListening ? 'Sun raha hu... (Listening)' : 'Speak Hindi / English'}</span>
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={userGoal}
              onChange={(e) => setUserGoal(e.target.value)}
              placeholder="Jaise: 'Stratum pool se connect karo, BTC aur LTC workers ki hashrate monitor karo, har 30 second me valid shares submit karo aur payouts calculate karte raho jab tak main STOP na bolu.'"
              className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed font-sans"
            />
            {userGoal && (
              <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-500">
                {userGoal.length} chars
              </div>
            )}
          </div>

          {/* Quick Idea Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Quick Samples:
            </span>
            <button
              type="button"
              onClick={() => setUserGoal("Stratum Bridge monitor karo: BTC/LTC hashrate check karo, valid shares compute karo aur 5% admin fee deduct karke balances update karte raho.")}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              ⛏️ Stratum Mining Loop
            </button>
            <button
              type="button"
              onClick={() => setUserGoal("Orderbook scan karo, crypto price spread check karo aur har cycle me profit calculation track karo.")}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              📈 Price Arbitrage Loop
            </button>
            <button
              type="button"
              onClick={() => setUserGoal("Social media feed se naye messages aur comments auto-reply karo aur engagement rate boost karo.")}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              💬 Social Media Auto-Pilot
            </button>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-base tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-cyan-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>AI AAPKA GOAL SAMAJH RAHA HAI... (DECOMPOSING OBJECTIVE)</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>START AUTONOMOUS WORK (KAAM SHURU KARO)</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-2.5">
            Yeh AI continuous loop me khud work karega. Aap kisi bhi samay upar <strong className="text-rose-400">STOP</strong> button dabakar ise rok sakte hain.
          </p>
        </div>
      </form>
    </div>
  );
};
