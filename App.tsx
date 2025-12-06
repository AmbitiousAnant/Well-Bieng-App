import React, { useState, useEffect } from 'react';
import { Shield, BarChart2, Settings, User, ToggleLeft, ToggleRight, Info, Users, Bot, MessageCircle, AlertCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PrivacyVault from './components/PrivacyVault';
import Intervention from './components/Intervention';
import SettingsView from './components/SettingsView';
import Chatbot from './components/Chatbot';
import { DATA_NORMAL, DATA_ELEVATED, DATA_RISK, MOCK_LOGS, WARNING_LOGS } from './constants';
import { RiskLevel, UserSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'VAULT' | 'SETTINGS'>('DASHBOARD');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.NORMAL);
  const [showIntervention, setShowIntervention] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [logs, setLogs] = useState(MOCK_LOGS);

  // Settings State
  const [settings, setSettings] = useState<UserSettings>({
    contacts: [
      { id: '1', name: "Dr. Sarah Cohen", phone: "555-0199", relation: "Mentor" }
    ],
    allowAutomatedAlerts: true,
    dataRetentionDays: 30,
    motivationConfig: { mode: 'TEXT' } // Default to TEXT motivation
  });

  // Cycle Simulation States
  const cycleSimulation = () => {
    if (riskLevel === RiskLevel.NORMAL) {
        setRiskLevel(RiskLevel.ELEVATED);
    } else if (riskLevel === RiskLevel.ELEVATED) {
        setRiskLevel(RiskLevel.CRITICAL);
    } else {
        setRiskLevel(RiskLevel.NORMAL);
    }
  };

  // Handle Simulation State Changes
  useEffect(() => {
    if (riskLevel === RiskLevel.NORMAL) {
        setLogs(MOCK_LOGS);
        setShowIntervention(false);
    } else if (riskLevel === RiskLevel.ELEVATED) {
        // Elevated: Minor anomalies, Proactive Chat
        setLogs([...MOCK_LOGS, { id: Date.now().toString(), timestamp: 'Now', category: 'ANALYSIS', message: 'Moderate deviation detected. Initiating companion check-in.', status: 'WARN' }]);
        setShowIntervention(false);
        
        // Auto-switch motivation to SPEECH mode for gentle support if not already set
        setSettings(prev => {
            if (prev.motivationConfig.mode !== 'SPEECH') {
                return {
                    ...prev,
                    motivationConfig: { mode: 'SPEECH' }
                };
            }
            return prev;
        });

        setTimeout(() => setShowChat(true), 800); // Slight delay for effect
    } else if (riskLevel === RiskLevel.CRITICAL) {
        // Critical: Major anomalies, Intervention Modal
        setLogs([...MOCK_LOGS, ...WARNING_LOGS]);
        setTimeout(() => setShowIntervention(true), 1500);
    }
  }, [riskLevel]);

  const getCurrentData = () => {
      switch (riskLevel) {
          case RiskLevel.ELEVATED: return DATA_ELEVATED;
          case RiskLevel.CRITICAL: return DATA_RISK;
          default: return DATA_NORMAL;
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  Partner
                </h1>
                <p className="text-xs text-slate-500">On-Device Wellness Guardian</p>
              </div>
            </div>

            <div className="hidden md:flex gap-6">
              <NavButton 
                active={activeTab === 'DASHBOARD'} 
                onClick={() => setActiveTab('DASHBOARD')}
                icon={<BarChart2 className="w-4 h-4" />}
                label="Wellness Monitor"
              />
              <NavButton 
                active={activeTab === 'SETTINGS'} 
                onClick={() => setActiveTab('SETTINGS')}
                icon={<Users className="w-4 h-4" />}
                label="Configuration"
              />
              <NavButton 
                active={activeTab === 'VAULT'} 
                onClick={() => setActiveTab('VAULT')}
                icon={<Settings className="w-4 h-4" />}
                label="Privacy Vault"
              />
            </div>

            <div className="flex items-center gap-4">
               {/* Simulation Toggle */}
              <div className="flex items-center gap-2 bg-slate-800/50 py-1 px-3 rounded-full border border-slate-700">
                <span className={`text-xs font-medium ${
                    riskLevel === RiskLevel.NORMAL ? 'text-emerald-400' : 
                    riskLevel === RiskLevel.ELEVATED ? 'text-amber-400' : 'text-red-400'
                }`}>
                    {riskLevel === RiskLevel.NORMAL ? "State: Balanced" : 
                     riskLevel === RiskLevel.ELEVATED ? "State: Elevated" : "State: Critical"}
                </span>
                <button 
                    onClick={cycleSimulation}
                    className="focus:outline-none transition-transform active:scale-95 hover:bg-slate-700 rounded-full p-1"
                    title="Cycle Simulation Mode"
                >
                   {riskLevel === RiskLevel.NORMAL && <ToggleLeft className="w-8 h-8 text-emerald-500" />}
                   {riskLevel === RiskLevel.ELEVATED && <AlertCircle className="w-8 h-8 text-amber-500" />}
                   {riskLevel === RiskLevel.CRITICAL && <ToggleRight className="w-8 h-8 text-red-500" />}
                </button>
              </div>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Context Banner */}
        <div className="mb-8 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 flex gap-3 items-start">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-400">
                <strong className="text-blue-300">Prototype Environment:</strong> 
                Use the toggle in the top right to simulate different user states: 
                <span className="text-emerald-400 font-semibold mx-1">Balanced</span> → 
                <span className="text-amber-400 font-semibold mx-1">Elevated (Gentle Voice Support)</span> → 
                <span className="text-red-400 font-semibold mx-1">Critical (Intervention)</span>.
            </div>
        </div>

        {activeTab === 'DASHBOARD' && (
          <Dashboard data={getCurrentData()} riskLevel={riskLevel} settings={settings} />
        )}

        {activeTab === 'SETTINGS' && (
            <SettingsView settings={settings} onUpdateSettings={setSettings} />
        )}

        {activeTab === 'VAULT' && (
          <PrivacyVault logs={logs} />
        )}
      </main>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4 pointer-events-none">
        {showChat && (
            <div className="pointer-events-auto w-[90vw] md:w-96 h-[500px] mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
                <Chatbot 
                    riskLevel={riskLevel} 
                    onClose={() => setShowChat(false)} 
                />
            </div>
        )}
        <button 
            onClick={() => setShowChat(!showChat)}
            className={`pointer-events-auto p-4 rounded-full shadow-lg shadow-indigo-900/50 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center relative ${
                showChat ? 'bg-slate-700 text-slate-300 rotate-90' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
        >
            {showChat ? <Settings className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
            
            {/* Notification Badge for Proactive Chat */}
            {!showChat && riskLevel === RiskLevel.ELEVATED && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                </span>
            )}
        </button>
      </div>

      {/* Intervention Modal */}
      {showIntervention && (
        <Intervention 
            settings={settings} 
            onDismiss={() => setShowIntervention(false)} 
        />
      )}
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
      active 
        ? 'text-white bg-slate-800 shadow-sm' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`}
  >
    {icon}
    {label}
  </button>
);