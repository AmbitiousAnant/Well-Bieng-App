import React from 'react';
import { Shield, Lock, Server, Smartphone, Key, FileText, Check } from 'lucide-react';
import { SystemLog } from '../types';

interface PrivacyVaultProps {
  logs: SystemLog[];
}

const PrivacyVault: React.FC<PrivacyVaultProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-48 h-48 text-emerald-500" />
        </div>
        
        <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                <Shield className="text-emerald-400" />
                Zero-Knowledge Sandbox
            </h2>
            <p className="text-slate-400 max-w-2xl mb-6">
                Sentinell operates entirely within a secure enclave on your device's Tegra/Snapdragon security chip. 
                Raw data (texts, videos, location) never leaves this sandbox. Only anonymized mathematical vectors 
                are used for anomaly detection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <SecurityBadge 
                    icon={<Smartphone className="w-5 h-5" />} 
                    title="On-Device Only" 
                    desc="No cloud uploads of personal media" 
                />
                 <SecurityBadge 
                    icon={<Key className="w-5 h-5" />} 
                    title="E2E Encrypted" 
                    desc="Keys stored in hardware backed keystore" 
                />
                 <SecurityBadge 
                    icon={<Server className="w-5 h-5" />} 
                    title="Offline Capable" 
                    desc="Works without internet connection" 
                />
            </div>
        </div>
      </div>

      <div className="bg-black/40 border border-slate-800 rounded-xl p-4 font-mono text-sm h-64 overflow-y-auto">
        <div className="flex items-center gap-2 text-slate-400 mb-4 sticky top-0 bg-black/80 p-2 border-b border-slate-800">
            <FileText className="w-4 h-4" />
            <span>Secure System Audit Log</span>
        </div>
        <div className="space-y-2">
            {logs.map((log) => (
                <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <span className="text-slate-500 w-20 flex-shrink-0">{log.timestamp}</span>
                    <span className={`w-24 flex-shrink-0 font-bold ${
                        log.category === 'ENCRYPTION' ? 'text-purple-400' :
                        log.category === 'SYSTEM' ? 'text-blue-400' : 'text-emerald-400'
                    }`}>[{log.category}]</span>
                    <span className={log.status === 'WARN' ? 'text-amber-400' : 'text-slate-300'}>
                        {log.message}
                    </span>
                    {log.status === 'SECURE' && <Lock className="w-3 h-3 text-emerald-500 mt-1 ml-auto" />}
                </div>
            ))}
            <div className="flex gap-4 animate-pulse">
                <span className="text-slate-500 w-20">...</span>
                <span className="text-slate-500">Monitoring secure enclave...</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const SecurityBadge = ({ icon, title, desc }: any) => (
    <div className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 text-emerald-400">
            {icon}
            <span className="font-semibold">{title}</span>
        </div>
        <span className="text-xs text-slate-500">{desc}</span>
    </div>
)

export default PrivacyVault;
