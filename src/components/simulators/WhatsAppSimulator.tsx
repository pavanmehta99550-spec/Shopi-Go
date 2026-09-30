import React, { useEffect, useState } from 'react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Search, 
  CheckCheck, 
  Phone, 
  Video, 
  MoreVertical,
  User
} from 'lucide-react';
import { AutomationStep } from '../../types';

interface WhatsAppSimulatorProps {
  currentStep: AutomationStep | null;
  stepProgress: number;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ currentStep, stepProgress }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'them' | 'me'; text: string; time: string; status: 'sent' | 'delivered' | 'read' }>>([
    { sender: 'them', text: 'Namaste! Kya haal chaal hai?', time: '10:15 AM', status: 'read' },
    { sender: 'me', text: 'Sab badhiya hai bhai, kaam chal raha hai!', time: '10:16 AM', status: 'read' },
    { sender: 'them', text: 'Order details send kar dena please.', time: '10:20 AM', status: 'read' }
  ]);

  const [typedInput, setTypedInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Sync with automation steps
  useEffect(() => {
    if (!currentStep) return;

    if (currentStep.actionType === 'TYPE' && currentStep.paramValue) {
      // Typewriter effect
      const targetText = currentStep.paramValue;
      let i = 0;
      setTypedInput('');
      const interval = setInterval(() => {
        if (i < targetText.length) {
          setTypedInput(targetText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }

    if (currentStep.actionType === 'CLICK' && currentStep.targetSelector === '#btn-send-message') {
      setIsSending(true);
      setTimeout(() => {
        if (typedInput.trim()) {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'me',
              text: typedInput,
              time: 'Just now',
              status: 'delivered'
            }
          ]);
          setTypedInput('');
        }
        setIsSending(false);
      }, 400);
    }
  }, [currentStep]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0b141a] text-slate-100 rounded-xl overflow-hidden border border-emerald-900/40 font-sans select-none text-xs">
      {/* Top Header of Simulated WhatsApp Web */}
      <div className="bg-[#202c33] px-4 py-2.5 flex items-center justify-between border-b border-slate-700/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white shadow">
            P
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Papa / Customer</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <Video className="w-4 h-4 cursor-pointer hover:text-white" />
          <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
          <Search className="w-4 h-4 cursor-pointer hover:text-white" />
          <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-[#0c1317]">
        <div className="text-center my-1">
          <span className="bg-[#182229] text-slate-400 px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-mono">
            TODAY
          </span>
        </div>

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-lg p-2.5 shadow relative ${
                m.sender === 'me'
                  ? 'bg-[#005c4b] text-white rounded-tr-none'
                  : 'bg-[#202c33] text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="text-xs leading-relaxed">{m.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-300">
                <span>{m.time}</span>
                {m.sender === 'me' && (
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Message Input Bar */}
      <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 border-t border-slate-700/60 shrink-0">
        <Smile className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer shrink-0" />
        <Paperclip className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer shrink-0" />

        <div 
          id="chat-message-input"
          className={`flex-1 bg-[#2a3942] rounded-lg px-3 py-2 text-white font-sans text-xs flex items-center justify-between border ${
            currentStep?.targetSelector === '#chat-message-input'
              ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-md'
              : 'border-transparent'
          }`}
        >
          <span className={typedInput ? 'text-white' : 'text-slate-500'}>
            {typedInput || 'Type a message...'}
          </span>
          {currentStep?.actionType === 'TYPE' && (
            <span className="w-1.5 h-3.5 bg-emerald-400 animate-pulse ml-0.5 inline-block" />
          )}
        </div>

        <button
          id="btn-send-message"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            currentStep?.targetSelector === '#btn-send-message'
              ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg ring-2 ring-emerald-300'
              : 'bg-[#00a884] text-white hover:bg-[#008f70]'
          } ${isSending ? 'animate-ping' : ''}`}
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppSimulator;
