
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend
} from 'recharts';
import { Activity, Moon, MessageCircle, HeartPulse, AlertTriangle, CheckCircle } from 'lucide-react';
import { DailyMetric, RiskLevel, UserSettings, SentimentAnalysis } from '../types';
import MotivationWidget from './MotivationWidget';

interface DashboardProps {
  data: DailyMetric[];
  riskLevel: RiskLevel;
  settings: UserSettings;
  realTimeSentiment?: SentimentAnalysis | null;
}

const Dashboard: React.FC<DashboardProps> = ({ data, riskLevel, settings, realTimeSentiment }) => {
  const isCritical = riskLevel === RiskLevel.CRITICAL;

  const getSentimentValue = () => {
    if (realTimeSentiment) {
      if (realTimeSentiment.score > 70) return "Positive";
      if (realTimeSentiment.score > 40) return "Neutral";
      return "Distress";
    }
    return isCritical ? "Distress" : "Positive";
  };

  const getSentimentSubtext = () => {
    if (realTimeSentiment) {
      return `AI Score: ${realTimeSentiment.score} (${realTimeSentiment.dominantEmotion})`;
    }
    return isCritical ? "Negative skew" : "Within normal range";
  };

  return (
    <div className="space-y-6">
      
      {/* AI Motivation Widget */}
      <MotivationWidget 
        mode={settings.motivationConfig.mode} 
        riskLevel={riskLevel} 
        settings={settings}
      />

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Sleep Hygiene" 
          value={isCritical ? "Irregular" : "Healthy"} 
          icon={<Moon className={isCritical ? "text-amber-500" : "text-emerald-400"} />} 
          subtext={isCritical ? "-4.5h vs Baseline" : "+0.2h vs Baseline"}
          alert={isCritical}
        />
        <StatCard 
          title="Social Index" 
          value={isCritical ? "Withdrawn" : "Active"} 
          icon={<MessageCircle className={isCritical ? "text-red-500" : "text-emerald-400"} />} 
          subtext={isCritical ? "80% Drop detected" : "Steady engagement"}
          alert={isCritical}
        />
        <StatCard 
          title="Sentiment" 
          value={getSentimentValue()} 
          icon={<HeartPulse className={isCritical || (realTimeSentiment && realTimeSentiment.score < 40) ? "text-red-500" : "text-emerald-400"} />} 
          subtext={getSentimentSubtext()}
          alert={isCritical || (realTimeSentiment && realTimeSentiment.score < 40)}
        />
        <StatCard 
          title="System Status" 
          value="Secure" 
          icon={<CheckCircle className="text-emerald-400" />} 
          subtext="Local Processing Only"
          alert={false}
        />
      </div>

      {/* Real-Time AI Sentiment Analysis */}
      {realTimeSentiment && (
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-indigo-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Nuanced AI Sentiment Analysis
            </h3>
            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
              Real-Time Contextual Analysis
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Score & Emotion */}
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <div className="text-5xl font-black text-white tracking-tighter">
                  {realTimeSentiment.score}
                </div>
                <div className="text-indigo-400 font-medium mb-1">/ 100</div>
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Dominant State</div>
                <div className="text-2xl font-bold text-white capitalize">{realTimeSentiment.dominantEmotion}</div>
              </div>
              <div className="pt-2">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Confidence</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-1000"
                    style={{ width: `${realTimeSentiment.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Nuance & Context */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Nuanced Insight</div>
                <p className="text-indigo-100/90 italic leading-relaxed text-lg">
                  "{realTimeSentiment.nuance}"
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {realTimeSentiment.detectedEmotions.map((em, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-indigo-500/10 p-3 rounded-lg">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase mb-1 truncate">{em.emotion}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-400 h-full"
                          style={{ width: `${em.intensity * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono text-indigo-300">
                        {Math.round(em.intensity * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Activity & Sentiment Trends */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Behavioral Baseline vs. Current
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="sentimentScore" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorSentiment)" 
                  name="Sentiment Score"
                />
                <Area 
                  type="monotone" 
                  dataKey="socialInteractions" 
                  stroke="#82ca9d" 
                  fillOpacity={1} 
                  fill="url(#colorSocial)" 
                  name="Social Activity"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Patterns */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-sm backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            Circadian Rhythm Analysis
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Bar dataKey="sleepHours" fill="#6366f1" radius={[4, 4, 0, 0]} name="Hours Asleep" />
                {isCritical && (
                   <Bar dataKey="mobilityScore" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Movement Index" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {isCritical && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-4 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
                <h4 className="text-red-200 font-semibold">Anomaly Detected</h4>
                <p className="text-red-200/80 text-sm mt-1">
                    Multiple high-confidence indicators suggest a significant deviation from your baseline. 
                    The system is initiating the pre-configured intervention protocol.
                </p>
            </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, subtext, alert }: any) => (
  <div className={`p-4 rounded-xl border backdrop-blur-sm transition-colors ${alert ? 'bg-red-900/20 border-red-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-slate-400 text-sm font-medium">{title}</span>
      {icon}
    </div>
    <div className={`text-2xl font-bold ${alert ? 'text-red-200' : 'text-slate-100'}`}>{value}</div>
    <div className={`text-xs mt-1 ${alert ? 'text-red-300' : 'text-slate-500'}`}>{subtext}</div>
  </div>
);

export default Dashboard;
