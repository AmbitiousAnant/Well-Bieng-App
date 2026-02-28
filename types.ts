
export enum RiskLevel {
  NORMAL = 'NORMAL',
  ELEVATED = 'ELEVATED',
  CRITICAL = 'CRITICAL'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface SentimentAnalysis {
  score: number; // 0 to 100
  dominantEmotion: string;
  nuance: string;
  confidence: number;
  detectedEmotions: { emotion: string; intensity: number }[];
}

export interface DailyMetric {
  day: string;
  sleepHours: number;
  socialInteractions: number;
  sentimentScore: number; // 0 to 100
  mobilityScore: number; // 0 to 100
}

export interface SystemLog {
  id: string;
  timestamp: string;
  category: 'ANALYSIS' | 'ENCRYPTION' | 'SYSTEM';
  message: string;
  status: 'OK' | 'WARN' | 'SECURE';
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface UserSettings {
  userName: string;
  contacts: Contact[];
  allowAutomatedAlerts: boolean;
  dataRetentionDays: number;
  motivationConfig: {
    mode: 'TEXT' | 'SPEECH' | 'OFF';
  };
}
