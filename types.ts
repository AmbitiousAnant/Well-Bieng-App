
export enum RiskLevel {
  NORMAL = 'NORMAL',
  ELEVATED = 'ELEVATED',
  CRITICAL = 'CRITICAL'
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
  contacts: Contact[];
  allowAutomatedAlerts: boolean;
  dataRetentionDays: number;
}
