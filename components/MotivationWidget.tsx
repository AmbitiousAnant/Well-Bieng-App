
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Volume2, Pause, VolumeX, Image as ImageIcon } from 'lucide-react';
import { ai } from '../genai';
import { Modality } from "@google/genai";
import { RiskLevel, UserSettings } from '../types';

interface MotivationWidgetProps {
  mode: 'TEXT' | 'SPEECH' | 'OFF';
  riskLevel?: RiskLevel;
  settings: UserSettings;
}

const THEMES = [
  "resilience found in nature",
  "the power of small, imperfect steps",
  "finding quiet in a noisy world",
  "radical self-compassion",
  "the perspective of time",
  "inner strength and endurance",
  "finding beauty in the present moment",
  "acceptance of what is",
  "hope as a discipline",
  "the courage to rest"
];

const MotivationWidget: React.FC<MotivationWidgetProps> = ({ mode, riskLevel, settings }) => {
  const [tip, setTip] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgImage, setBgImage] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  
  const generateTip = async () => {
    if (mode === 'OFF') return;
    setLoading(true);
    setImageLoading(true);
    setIsPlaying(false);
    setBgImage(''); // Reset image while loading
    
    // Cleanup previous context
    if (audioContext) {
        try {
            await audioContext.close();
        } catch (e) {
            console.warn("Error closing audio context", e);
        }
        setAudioContext(null);
    }

    try {
      // 1. Generate Text with Dynamic Prompt (Personalized)
      const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
      
      let prompt = `Generate a unique, fresh, and non-cliché single-sentence quote or insight about '${randomTheme}' specifically for a user named ${settings.userName}. It should be inspiring, thought-provoking, and original. Avoid common overused phrases like 'hang in there' or 'you got this'.`;
      
      if (riskLevel === RiskLevel.ELEVATED || riskLevel === RiskLevel.CRITICAL) {
          prompt = `Generate a gentle, warm, and deeply soothing single-sentence insight about '${randomTheme}' for ${settings.userName} who is feeling vulnerable. Focus on validation, safety, and kindness. Avoid toxic positivity. It should feel like a comforting hug.`;
      }

      // Parallel Execution: Text and Image
      const textPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash', 
        contents: prompt,
        config: { temperature: 1.2 }
      });

      // Visual Intelligence: Generate Ambient Background
      // Use 'gemini-2.5-flash-image' for visual generation
      const imagePrompt = `A soft, abstract, calming, minimal wallpaper style digital art representing '${randomTheme}'. Gentle pastel colors, soothing gradient, no text, high quality.`;
      const imagePromise = ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: imagePrompt }] }
      });

      // Wait for text first to show immediate feedback
      const textResponse = await textPromise;
      const newTip = textResponse.text?.trim() || "The stars are still there, even behind the clouds.";
      setTip(newTip);
      setLoading(false); // Text is ready

      // Handle Image Result
      imagePromise.then(imageResponse => {
          // Iterate through parts to find the image
          let foundImage = false;
          for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
              if (part.inlineData) {
                  const base64EncodeString = part.inlineData.data;
                  setBgImage(`data:image/png;base64,${base64EncodeString}`);
                  foundImage = true;
                  break;
              }
          }
          if(!foundImage) {
              console.log("No image generated in response parts");
          }
          setImageLoading(false);
      }).catch(err => {
          console.error("Image gen error", err);
          setImageLoading(false);
      });

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
      setTip("Take a gentle breath; you are doing the best you can.");
      setLoading(false);
      setImageLoading(false);
    }
  };

  const playAudio = async (base64: string) => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass({sampleRate: 24000});
        
        // Handle autoplay policy
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        setAudioContext(ctx);
        
        // Decode Base64 to ArrayBuffer
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Decode PCM logic (Raw PCM 24kHz 1ch)
        const dataInt16 = new Int16Array(bytes.buffer);
        const audioBuffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
             channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
            setIsPlaying(false);
        };
        source.start();
        setIsPlaying(true);
    } catch (e) {
        console.error("Audio playback error", e);
    }
  };

  useEffect(() => {
    generateTip();
    return () => {
        if (audioContext) {
            audioContext.close().catch(console.error);
        }
    }
  }, [mode, riskLevel]);

  if (mode === 'OFF') return null;

  return (
    <div className={`border rounded-xl p-6 mb-6 relative overflow-hidden transition-colors min-h-[160px] flex flex-col justify-center ${
        riskLevel === RiskLevel.ELEVATED || riskLevel === RiskLevel.CRITICAL 
        ? 'bg-gradient-to-r from-amber-900/30 to-slate-900/40 border-amber-500/20' 
        : 'bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border-indigo-500/20'
    }`}>
        {/* Generated Background Image */}
        {bgImage && (
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 opacity-30"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
        )}
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/90 to-slate-900/40" />

        <div className="absolute top-0 right-0 p-4 opacity-10 z-10">
            <Sparkles className={`w-32 h-32 ${riskLevel === RiskLevel.ELEVATED ? 'text-amber-400' : 'text-indigo-400'}`} />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
                <div className={`flex items-center gap-2 mb-2 text-sm font-semibold uppercase tracking-wider ${
                     riskLevel === RiskLevel.ELEVATED || riskLevel === RiskLevel.CRITICAL ? 'text-amber-400' : 'text-indigo-400'
                }`}>
                    <Sparkles className="w-4 h-4" />
                    <span>{riskLevel === RiskLevel.ELEVATED ? `Gentle Reminder for ${settings.userName}` : `Daily Insight for ${settings.userName}`}</span>
                </div>
                <p className="text-lg sm:text-xl font-medium text-slate-100 italic min-h-[3rem] flex items-center shadow-black drop-shadow-md">
                    {loading ? (
                        <span className="flex items-center gap-2 text-slate-400 text-base not-italic">
                             <RefreshCw className="w-4 h-4 animate-spin" />
                             Generating personalized insight...
                        </span>
                    ) : (
                        `"${tip}"`
                    )}
                </p>
                {imageLoading && !loading && (
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-2 animate-pulse">
                        <ImageIcon className="w-3 h-3" />
                        Creating ambient background...
                    </div>
                )}
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
