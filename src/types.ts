export type AgentStatus = 'idle' | 'analyzing' | 'running' | 'paused' | 'completed' | 'stopped';

export type SupportedAppId = 'whatsapp' | 'youtube' | 'sheets' | 'forms' | 'instagram' | 'custom';

export type ActiveStudioMode = 'browser_agent' | 'mobile_macro';

export interface MobileTapDot {
  id: string;
  order: number;
  label: string;
  xPercent: number; // 0 to 100 on screen
  yPercent: number; // 0 to 100 on screen
  action: 'tap' | 'double_tap' | 'long_press' | 'swipe_up' | 'wait';
  delayMs: number;
  repeatCount: number;
  note?: string;
}

export interface AutomationStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  actionType: 'NAVIGATE' | 'LOCATE' | 'TYPE' | 'CLICK' | 'SCROLL' | 'WAIT' | 'VERIFY';
  targetSelector: string;
  paramValue?: string;
  cursorTarget?: { x: number; y: number }; // Percentage 0-100 for visual AI mouse
  status: 'pending' | 'running' | 'completed' | 'failed';
  resultMessage?: string;
}

export interface AutomationRecipe {
  id: string;
  appName: string;
  appId: SupportedAppId;
  appUrl: string;
  userPrompt: string;
  steps: AutomationStep[];
  goalSummaryHindi: string;
  goalSummaryEnglish: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  type: 'system' | 'ai_thought' | 'action' | 'success' | 'warning' | 'user';
  message: string;
  stepNumber?: number;
}

export interface AppTemplate {
  id: SupportedAppId;
  name: string;
  iconName: string;
  badge: string;
  defaultUrl: string;
  hindiDescription: string;
  samplePrompts: string[];
}
