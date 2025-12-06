
import React, { useState, useEffect } from 'react';
import { Shield, BarChart2, Settings, User, AlertCircle, ToggleLeft, ToggleRight, Info, Users } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PrivacyVault from './components/PrivacyVault';
import Intervention from './components/Intervention';
import SettingsView from './components/SettingsView';
import { DATA_NORMAL, DATA_RISK, MOCK_LOGS, WARNING_LOGS } from './constants';
import { RiskLevel, UserSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'VAULT' | 'SETTINGS'>('DASHBOARD');
  const [simulationMode, setSimulationMode] = useState<boolean>(false);
  const [showIntervention, setShowIntervention] = useState<boolean>(false);
  const [logs, setLogs] = useState(MOCK_LOGS);

  // Settings State
  const [settings, setSettings] = useState<UserSettings>({
    contacts: [
      { id: '1', name: "Dr. Sarah Cohen", phone: "555-0199", relation: "Mentor" }
    ],
    allowAutomatedAlerts: true,
    dataRetentionDays: 30
  });

  // Handle Simulation Toggle
  useEffect(() => {
    if (simulationMode) {
      // Simulate processing time then showing risk
      const timer = setTimeout(() => {
        setLogs([...MOCK_LOGS, ...WARNING_LOGS]);
        setShowIntervention(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setLogs(MOCK_LOGS);
      setShowIntervention(false);
    }
  }, [simulationMode]);

  const currentData = simulationMode ? DATA_RISK : DATA_NORMAL;
  const currentRisk = simulationMode ? RiskLevel.CRITICAL : RiskLevel.NORMAL;

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
                  Sentinell
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
                <span className="text-xs font-medium text-slate-400">
                    {simulationMode ? "Simulating: Distress" : "Simulating: Baseline"}
                </span>
                <button 
                    onClick={() => setSimulationMode(!simulationMode)}
                    className="focus:outline-none transition-transform active:scale-95"
                >
                    {simulationMode ? (
                        <ToggleRight className="w-8 h-8 text-red-500" />
                    ) : (
                        <ToggleLeft className="w-8 h-8 text-emerald-500" />
                    )}
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
                <strong className="text-blue-300">Prototype Environment:</strong> This application demonstrates the user interface for the proposed operating-system level "Wellness Guardian". 
                It visualizes how local anomaly detection works without compromising user privacy. 
                Toggle the simulation switch above to see how the system reacts to behavioral changes.
            </div>
        </div>

        {activeTab === 'DASHBOARD' && (
          <Dashboard data={currentData} riskLevel={currentRisk} />
        )}
        
        {activeTab === 'SETTINGS' && (
            <SettingsView settings={settings} onUpdateSettings={setSettings} />
        )}

        {activeTab === 'VAULT' && (
          <PrivacyVault logs={logs} />
        )}
      </main>

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
