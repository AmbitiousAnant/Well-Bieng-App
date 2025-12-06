import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend
} from 'recharts';
import { Activity, Moon, MessageCircle, HeartPulse, AlertTriangle, CheckCircle } from 'lucide-react';
import { DailyMetric, RiskLevel } from '../types';

interface DashboardProps {
  data: DailyMetric[];
  riskLevel: RiskLevel;
}

const Dashboard: React.FC<DashboardProps> = ({ data, riskLevel }) => {
  const isCritical = riskLevel === RiskLevel.CRITICAL;

  return (
    <div className="space-y-6">
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
          value={isCritical ? "Distress" : "Positive"} 
          icon={<HeartPulse className={isCritical ? "text-red-500" : "text-emerald-400"} />} 
          subtext={isCritical ? "Negative skew" : "Within normal range"}
          alert={isCritical}
        />
        <StatCard 
          title="System Status" 
          value="Secure" 
          icon={<CheckCircle className="text-emerald-400" />} 
          subtext="Local Processing Only"
          alert={false}
        />
      </div>

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
