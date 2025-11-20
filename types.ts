export interface ThemeVariant {
  id: string;
  labelEN: string;
  labelZH: string;
  primary: string;
  secondary: string;
  accent: string;
  backgroundLight: string;
  backgroundDark: string;
  surfaceLight: string;
  surfaceDark: string;
}

export type Language = 'en' | 'zhTW';
export type Page = 'agents' | 'attachment' | 'notes' | 'dashboard';
export type ModelProvider = 'Gemini' | 'OpenAI' | 'Anthropic';

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export interface PromptTemplate {
  id: string;
  label: string;
  systemPrompt: string;
}

export interface DashboardMetrics {
  totalRequests: number;
  avgLatency: number;
  tokensUsed: number;
  activeModel: string;
}
