import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Volume2, Pause, VolumeX } from 'lucide-react';
import { ai } from '../genai';
import { Modality } from "@google/genai";
import { RiskLevel } from '../types';

interface MotivationWidgetProps {
  mode: 'TEXT' | 'SPEECH' | 'OFF';
  riskLevel?: RiskLevel;
}

const MotivationWidget: React.FC<MotivationWidgetProps> = ({ mode, riskLevel }) => {
  const [tip, setTip] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const generateTip = async () => {
    if (mode === 'OFF') return;
    setLoading(true);
    setIsPlaying(false);
    if (audioContext) {
        audioContext.close();
        setAudioContext(null);
    }

    try {
      // 1. Generate Text with Context-Aware Prompt
      let prompt = "Generate a short, very inspiring, single-sentence quote or mental health tip. It should be warm and encouraging.";
      
      if (riskLevel === RiskLevel.ELEVATED || riskLevel === RiskLevel.CRITICAL) {
          prompt = "Generate a gentle, warm, and comforting short sentence for someone who is feeling a bit low or stressed. Focus on validation and gentle support. Do not be overly toxic positive.";
      }

      const textResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      
      const newTip = textResponse.text?.trim() || "You are stronger than you know.";
      setTip(newTip);

      // 2. If Speech mode, Generate Audio
      if (mode === 'SPEECH') {
        const audioResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-tts',
          contents: [{ parts: [{ text: newTip }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });

        const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            playAudio(base64Audio);
        }
      }
    } catch (error) {
      console.error("GenAI Error:", error);
      setTip("Take a deep breath. You're doing great.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (base64: string) => {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        setAudioContext(ctx);
        
        // Decode Base64 to ArrayBuffer
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Decode PCM logic
        // The API returns raw PCM. We need to put it into an AudioBuffer.
        // Assuming 24kHz sample rate and 1 channel as per typical config
        const dataInt16 = new Int16Array(bytes.buffer);
        const audioBuffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
             channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        setIsPlaying(true);
    } catch (e) {
        console.error("Audio playback error", e);
    }
  };

  useEffect(() => {
    // Generate new tip when mode changes OR riskLevel changes (e.g. going from Normal to Elevated)
    generateTip();
    return () => {
        if (audioContext) audioContext.close();
    }
  }, [mode, riskLevel]);

  if (mode === 'OFF') return null;

  return (
    <div className={`border rounded-xl p-6 mb-6 relative overflow-hidden transition-colors ${
        riskLevel === RiskLevel.ELEVATED || riskLevel === RiskLevel.CRITICAL 
        ? 'bg-gradient-to-r from-amber-900/30 to-slate-900/40 border-amber-500/20' 
        : 'bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border-indigo-500/20'
    }`}>
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className={`w-32 h-32 ${riskLevel === RiskLevel.ELEVATED ? 'text-amber-400' : 'text-indigo-400'}`} />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
                <div className={`flex items-center gap-2 mb-2 text-sm font-semibold uppercase tracking-wider ${
                     riskLevel === RiskLevel.ELEVATED || riskLevel === RiskLevel.CRITICAL ? 'text-amber-400' : 'text-indigo-400'
                }`}>
                    <Sparkles className="w-4 h-4" />
                    <span>{riskLevel === RiskLevel.ELEVATED ? "Gentle Reminder" : "Daily Insight"}</span>
                </div>
                <p className="text-lg sm:text-xl font-medium text-slate-100 italic">
                    "{loading ? "Finding the right words..." : tip}"
                </p>
            </div>
            
            <div className="flex gap-2">
                {mode === 'SPEECH' && (
                    <button 
                        className={`p-2 rounded-lg transition-colors ${isPlaying ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-indigo-400'}`}
                        disabled={loading}
                    >
                         {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                )}
                <button 
                    onClick={generateTip}
                    disabled={loading}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors border border-slate-700"
                    title="Get new tip"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default MotivationWidget;