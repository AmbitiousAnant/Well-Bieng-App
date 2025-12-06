
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { Phone, ArrowRight, X, HeartHandshake, AlertOctagon, Timer, Send, MapPin, CheckCircle, AlertTriangle, Users } from 'lucide-react';

interface InterventionProps {
  settings: UserSettings;
  onDismiss: () => void;
}

const Intervention: React.FC<InterventionProps> = ({ settings, onDismiss }) => {
  const [step, setStep] = useState<'NUDGE' | 'EMERGENCY' | 'AUTO_ACTION'>('NUDGE');
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds for prototype demonstration
  const [attempt, setAttempt] = useState(1); // 1 = First Chance, 2 = Second Chance

  // Safety Timer Logic (Dead Man's Switch)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Only run timer if enabled, in NUDGE step, and time remains
    if (step === 'NUDGE' && settings.allowAutomatedAlerts && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } 
    // Trigger action when time hits 0
    else if (timeLeft === 0 && step === 'NUDGE') {
      if (attempt < 2) {
        // Give second chance
        setAttempt(2);
        setTimeLeft(15); // Reset timer for 2nd chance
      } else {
        // All chances used
        setStep('AUTO_ACTION');
      }
    }

    return () => clearInterval(interval);
  }, [step, timeLeft, settings.allowAutomatedAlerts, attempt]);

  // Render: Automated Action Taken
  if (step === 'AUTO_ACTION') {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md animate-in zoom-in-95 duration-500">
            <div className="bg-slate-900 border border-red-500 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Send className="w-10 h-10 text-red-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">Emergency Protocol Active</h2>
                    <p className="text-red-200/80 mb-6">
                        No response detected after multiple attempts. 
                        Initiating emergency calls to priority services and your trusted network.
                    </p>

                    <div className="bg-slate-800/50 rounded-xl p-4 text-left space-y-3 mb-6 border border-slate-700 max-h-60 overflow-y-auto">
                        <div className="flex items-center gap-3 text-slate-300">
                             <Phone className="w-5 h-5 text-red-500 animate-pulse" />
                            <span className="font-mono font-bold text-red-400">Calling: 1800-891-4416</span>
                        </div>
                         <div className="flex items-center gap-3 text-slate-300">
                             <Phone className="w-5 h-5 text-red-500 animate-pulse delay-75" />
                            <span className="font-mono font-bold text-red-400">Calling: 102 (Ambulance)</span>
                        </div>
                         <div className="flex items-center gap-3 text-slate-300">
                             <Phone className="w-5 h-5 text-red-500 animate-pulse delay-150" />
                            <span className="font-mono font-bold text-red-400">Calling: 14416 (Tele-MANAS)</span>
                        </div>

                        {settings.contacts.map((contact, idx) => (
                           <div key={contact.id} className="flex items-center gap-3 text-slate-300 border-t border-slate-700/50 pt-2 mt-2">
                             <Phone className="w-5 h-5 text-indigo-400 animate-pulse" />
                            <span className="font-mono font-bold text-indigo-300">Alerting: {contact.name}</span>
                          </div>
                        ))}

                        <div className="flex items-center gap-3 text-slate-300 pt-2 border-t border-slate-700 mt-2">
                            <MapPin className="w-5 h-5 text-emerald-500" />
                            <span>GPS Location Sent</span>
                        </div>
                    </div>

                    <button 
                        onClick={onDismiss}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 py-3 rounded-lg text-sm transition-colors border border-slate-700"
                    >
                        I am safe (Cancel Action)
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // Render: Nudge (Check-in) with 2 Chances
  if (step === 'NUDGE') {
    const isUrgent = attempt === 2;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className={`bg-slate-900 border ${isUrgent ? 'border-red-500 shadow-red-500/20' : 'border-slate-700'} w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative transition-colors duration-500`}>
          
          {/* Progress Bar for Safety Timer */}
          {settings.allowAutomatedAlerts && (
             <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
                 <div 
                    className={`h-full transition-all duration-1000 ease-linear ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                 />
             </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isUrgent ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                    {isUrgent ? <AlertTriangle className="text-red-500 w-6 h-6" /> : <HeartHandshake className="text-blue-400 w-6 h-6" />}
                </div>
                {settings.allowAutomatedAlerts && (
                    <div className={`flex items-center gap-2 text-xs font-mono px-2 py-1 rounded border ${isUrgent ? 'text-red-300 bg-red-500/10 border-red-500/20' : 'text-blue-300 bg-blue-500/10 border-blue-500/20'}`}>
                        <Timer className="w-3 h-3" />
                        <span>Auto-Escalate: {timeLeft}s</span>
                    </div>
                )}
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
                {isUrgent ? "FINAL SAFETY CHECK" : "Check-in Required"}
            </h2>
            <p className="text-slate-300 mb-6">
              {isUrgent 
                ? "You missed the first check-in. If you do not respond, we will immediately call emergency services and your trusted contacts." 
                : "Hi there. We've noticed some changes in your routine that often correlate with high stress. Please confirm you are okay."
              }
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={onDismiss}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-between group text-white ${isUrgent ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                <span>I'm okay (Reset Timer)</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button 
                 onClick={() => setStep('EMERGENCY')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-4 rounded-lg font-medium transition-colors border border-slate-700"
              >
                I'm actually struggling
              </button>

               <button 
                 onClick={onDismiss}
                className="w-full text-slate-500 hover:text-slate-400 py-2 text-sm"
              >
                Dismiss (False Positive)
              </button>
            </div>
            
             {/* Attempt indicator */}
             <div className="flex gap-1 justify-center mt-4">
                <div className={`h-1.5 w-1.5 rounded-full ${attempt >= 1 ? (isUrgent ? 'bg-red-500' : 'bg-blue-500') : 'bg-slate-700'}`}></div>
                <div className={`h-1.5 w-1.5 rounded-full ${attempt >= 2 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
             </div>

          </div>
          <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Wellness Guardian v2.2</span>
            <span className="flex items-center gap-1"><LockIcon/> Encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  // Render: Manual Emergency Options
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-in zoom-in-95 duration-300">
      <div className="bg-slate-900 border border-red-500/50 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
        <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-500/20 p-3 rounded-full">
                    <AlertOctagon className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Support Options</h2>
                    <p className="text-red-200/80">You are not alone. Help is available.</p>
                </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Trusted Network</div>
                
                {settings.contacts.length > 0 ? (
                  settings.contacts.map((contact) => (
                    <div key={contact.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-indigo-400">{contact.relation}</div>
                            <div className="text-lg font-semibold text-white">{contact.name}</div>
                            <div className="text-xs text-slate-500">{contact.phone}</div>
                        </div>
                        <button className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 text-slate-500">
                    No supporters configured.
                  </div>
                )}

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="text-sm text-slate-400 mb-2 font-semibold uppercase tracking-wider">Crisis Resources</div>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg text-sm font-medium border border-slate-600">
                            Text 988
                        </button>
                        <button className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg text-sm font-medium border border-slate-600">
                            Self-Harm Prevention
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center">
                <button onClick={onDismiss} className="text-slate-500 hover:text-slate-300 text-sm">
                    Close Support Window
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const LockIcon = () => (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
)

export default Intervention;
