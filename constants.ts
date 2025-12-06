import { DailyMetric, RiskLevel, SystemLog } from './types';

// Baseline "Healthy" Data
export const DATA_NORMAL: DailyMetric[] = [
  { day: 'Mon', sleepHours: 7.5, socialInteractions: 45, sentimentScore: 82, mobilityScore: 85 },
  { day: 'Tue', sleepHours: 7.2, socialInteractions: 50, sentimentScore: 78, mobilityScore: 80 },
  { day: 'Wed', sleepHours: 8.0, socialInteractions: 42, sentimentScore: 85, mobilityScore: 75 },
  { day: 'Thu', sleepHours: 6.8, socialInteractions: 55, sentimentScore: 75, mobilityScore: 90 },
  { day: 'Fri', sleepHours: 7.0, socialInteractions: 60, sentimentScore: 88, mobilityScore: 85 },
  { day: 'Sat', sleepHours: 8.5, socialInteractions: 30, sentimentScore: 90, mobilityScore: 60 },
  { day: 'Sun', sleepHours: 8.2, socialInteractions: 35, sentimentScore: 92, mobilityScore: 55 },
];

// Elevated "Check-In" Data (Minor deviations)
export const DATA_ELEVATED: DailyMetric[] = [
  { day: 'Mon', sleepHours: 7.5, socialInteractions: 45, sentimentScore: 80, mobilityScore: 85 },
  { day: 'Tue', sleepHours: 6.5, socialInteractions: 40, sentimentScore: 75, mobilityScore: 80 },
  { day: 'Wed', sleepHours: 6.0, socialInteractions: 35, sentimentScore: 70, mobilityScore: 75 },
  { day: 'Thu', sleepHours: 5.8, socialInteractions: 30, sentimentScore: 65, mobilityScore: 70 },
  { day: 'Fri', sleepHours: 5.5, socialInteractions: 25, sentimentScore: 60, mobilityScore: 65 },
  { day: 'Sat', sleepHours: 5.0, socialInteractions: 20, sentimentScore: 58, mobilityScore: 50 },
  { day: 'Sun', sleepHours: 5.2, socialInteractions: 15, sentimentScore: 55, mobilityScore: 45 },
];

// Critical Anomaly Data (Sleep fragmentation, social withdrawal, drop in sentiment)
export const DATA_RISK: DailyMetric[] = [
  { day: 'Mon', sleepHours: 7.5, socialInteractions: 45, sentimentScore: 82, mobilityScore: 85 },
  { day: 'Tue', sleepHours: 5.2, socialInteractions: 20, sentimentScore: 65, mobilityScore: 60 },
  { day: 'Wed', sleepHours: 4.5, socialInteractions: 12, sentimentScore: 55, mobilityScore: 40 },
  { day: 'Thu', sleepHours: 3.8, socialInteractions: 5, sentimentScore: 45, mobilityScore: 25 },
  { day: 'Fri', sleepHours: 12.0, socialInteractions: 2, sentimentScore: 35, mobilityScore: 10 }, // Oversleeping/Depression
  { day: 'Sat', sleepHours: 3.0, socialInteractions: 0, sentimentScore: 28, mobilityScore: 5 },
  { day: 'Sun', sleepHours: 2.5, socialInteractions: 0, sentimentScore: 20, mobilityScore: 2 },
];

export const MOCK_LOGS: SystemLog[] = [
  { id: '1', timestamp: '10:00:01', category: 'SYSTEM', message: 'Sandbox environment verified.', status: 'SECURE' },
  { id: '2', timestamp: '10:00:05', category: 'ENCRYPTION', message: 'Local keys rotated successfully.', status: 'SECURE' },
  { id: '3', timestamp: '10:05:22', category: 'ANALYSIS', message: 'Processing keyboard patterns (On-Device).', status: 'OK' },
  { id: '4', timestamp: '10:15:00', category: 'ANALYSIS', message: 'Aggregating sleep cycle data.', status: 'OK' },
];

export const WARNING_LOGS: SystemLog[] = [
  { id: '5', timestamp: '11:20:00', category: 'ANALYSIS', message: 'Anomaly detected: Social interaction drop > 80%.', status: 'WARN' },
  { id: '6', timestamp: '11:22:15', category: 'ANALYSIS', message: 'Sentiment analysis deviates from baseline.', status: 'WARN' },
  { id: '7', timestamp: '11:22:16', category: 'SYSTEM', message: 'Preparing Gentle Nudge protocol.', status: 'OK' },
];