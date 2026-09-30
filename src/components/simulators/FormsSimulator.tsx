import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileText, Send, Sparkles } from 'lucide-react';
import { AutomationStep } from '../../types';

interface FormsSimulatorProps {
  currentStep: AutomationStep | null;
  stepProgress: number;
}

export const FormsSimulator: React.FC<FormsSimulatorProps> = ({ currentStep, stepProgress }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    category: 'AI Engineering & Automation',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!currentStep) return;

    if (currentStep.id === 'f-2' && currentStep.paramValue) {
      setFormData((prev) => ({ ...prev, fullName: currentStep.paramValue || '' }));
    }

    if (currentStep.id === 'f-3' && currentStep.paramValue) {
      setFormData((prev) => ({ ...prev, email: currentStep.paramValue || '' }));
    }

    if (currentStep.id === 'f-5' && currentStep.paramValue) {
      setFormData((prev) => ({ ...prev, message: currentStep.paramValue || '' }));
    }

    if (currentStep.id === 'f-6' || currentStep.targetSelector === '#btn-submit-form') {
      setIsSubmitted(true);
    }
  }, [currentStep]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-slate-100 rounded-xl overflow-hidden border border-blue-950 font-sans select-none text-xs">
      {/* Form Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 p-4 border-b border-blue-800/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Client Project Registration Form</h3>
            <p className="text-[11px] text-blue-200/80">Auto-filled and verified via AutoTasker Engine</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
          SSL ENCRYPTED
        </span>
      </div>

      {/* Form Body or Success Screen */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {isSubmitted ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6 bg-slate-900/60 rounded-xl border border-emerald-500/40">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-base">Application Submitted Successfully!</h4>
              <p className="text-xs text-slate-300">
                Your response has been recorded in the database. Auto-notification sent.
              </p>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded border border-emerald-800">
              Confirmation ID: #AT-{Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 max-w-md mx-auto">
            {/* Field 1: Full Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Full Name *</span>
                {formData.fullName && <span className="text-emerald-400 text-[10px]">Filled ✓</span>}
              </label>
              <div
                id="input-fullname"
                className={`p-2 rounded-lg bg-slate-900/90 border transition-all text-xs ${
                  currentStep?.targetSelector === '#input-fullname'
                    ? 'border-blue-400 ring-2 ring-blue-500/50 text-white'
                    : 'border-slate-800 text-slate-300'
                }`}
              >
                {formData.fullName || <span className="text-slate-600">Enter your full name</span>}
              </div>
            </div>

            {/* Field 2: Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Email Address *</span>
                {formData.email && <span className="text-emerald-400 text-[10px]">Verified ✓</span>}
              </label>
              <div
                id="input-email"
                className={`p-2 rounded-lg bg-slate-900/90 border transition-all text-xs ${
                  currentStep?.targetSelector === '#input-email'
                    ? 'border-blue-400 ring-2 ring-blue-500/50 text-white'
                    : 'border-slate-800 text-slate-300'
                }`}
              >
                {formData.email || <span className="text-slate-600">e.g. name@domain.com</span>}
              </div>
            </div>

            {/* Field 3: Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Service Category</label>
              <div
                id="dropdown-category"
                className={`p-2 rounded-lg bg-slate-900/90 border text-xs text-blue-300 flex items-center justify-between ${
                  currentStep?.targetSelector === '#dropdown-category'
                    ? 'border-blue-400 ring-2 ring-blue-500/50'
                    : 'border-slate-800'
                }`}
              >
                <span>{formData.category}</span>
                <span className="text-slate-500">▼</span>
              </div>
            </div>

            {/* Field 4: Message */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Requirements / Order Notes</label>
              <div
                id="textarea-requirements"
                className={`p-2 rounded-lg bg-slate-900/90 border min-h-[50px] text-xs ${
                  currentStep?.targetSelector === '#textarea-requirements'
                    ? 'border-blue-400 ring-2 ring-blue-500/50 text-white'
                    : 'border-slate-800 text-slate-300'
                }`}
              >
                {formData.message || <span className="text-slate-600">Additional notes...</span>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-form"
              className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                currentStep?.targetSelector === '#btn-submit-form'
                  ? 'bg-blue-500 text-slate-950 scale-102 ring-2 ring-blue-300 shadow-lg shadow-blue-500/40'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Registration Form</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormsSimulator;
