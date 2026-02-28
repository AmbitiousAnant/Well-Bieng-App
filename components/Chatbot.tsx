import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, X } from 'lucide-react';
import { ai } from '../genai';
import { Chat, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import { RiskLevel, Message, SentimentAnalysis } from '../types';
import { analyzeSentiment } from '../services/sentimentService';

interface ChatbotProps {
    onClose?: () => void;
    riskLevel?: RiskLevel;
    onSentimentAnalysis?: (analysis: SentimentAnalysis) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose, riskLevel }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: "Hello. I'm your Partner companion. I'm here to listen without judgment. How are you feeling today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const hasTriggeredProactive = useRef(false);

  // Initialize chat session on mount or when deep thinking mode changes
  useEffect(() => {
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    chatSessionRef.current = ai.chats.create({
      model: 'gemini-3.1-pro-preview',
      history: history.length > 0 ? history : undefined,
      config: {
        systemInstruction: "You are a supportive, empathetic mental health AI companion named Partner. Your goal is to provide a safe space for the user. Be concise, gentle, and encouraging. Do not provide medical advice, but do suggest professional help if the user seems in danger. Keep responses under 100 words unless asked for more. If 'Deep Thinking' is enabled, you should provide more profound, reflective, and nuanced insights into the user's emotional state.",
        thinkingConfig: isDeepThinking ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
      },
    });
  }, [isDeepThinking]);

  // Proactive Check-in Logic
  useEffect(() => {
    if (riskLevel === RiskLevel.ELEVATED && !hasTriggeredProactive.current) {
        const proactiveMsg: Message = {
            id: Date.now().toString(),
            role: 'model',
            text: "I've noticed your routine has been a bit different lately, and things seem a little off. No pressure, but I'm here if you want to chat about what's on your mind."
        };
        setMessages(prev => [...prev, proactiveMsg]);
        hasTriggeredProactive.current = true;
    }
  }, [riskLevel]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputValue };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    // Analyze sentiment after user message
    analyzeSentiment(updatedMessages).then(analysis => {
      if (analysis && onSentimentAnalysis) {
        onSentimentAnalysis(analysis);
      }
    });

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullResponse = '';
      const modelMsgId = (Date.now() + 1).toString();
      
      // Add placeholder for streaming
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullResponse += c.text;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
          ));
        }
      }

      // Final analysis after model response
      const finalMessages = [...updatedMessages, { id: modelMsgId, role: 'model', text: fullResponse }];
      analyzeSentiment(finalMessages).then(analysis => {
        if (analysis && onSentimentAnalysis) {
          onSentimentAnalysis(analysis);
        }
      });
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${riskLevel === RiskLevel.ELEVATED ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                <Sparkles className={`w-5 h-5 ${riskLevel === RiskLevel.ELEVATED ? 'text-amber-400' : 'text-emerald-400'}`} />
            </div>
            <div>
            <h2 className="font-semibold text-slate-100">Partner Assistant</h2>
            <p className="text-xs text-slate-400">
                {riskLevel === RiskLevel.ELEVATED ? "Checking in..." : "Powered by Gemini 3.1 Pro"}
            </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsDeepThinking(!isDeepThinking)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    isDeepThinking 
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                    : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-400'
                }`}
                title={isDeepThinking ? "Deep Thinking Active" : "Enable Deep Thinking"}
            >
                <Sparkles className={`w-3 h-3 ${isDeepThinking ? 'animate-pulse' : ''}`} />
                {isDeepThinking ? 'Thinking High' : 'Standard'}
            </button>
            {onClose && (
                <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/30 rounded-tr-sm' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
            }`}>
              {msg.text || <span className="animate-pulse">...</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-4 pr-12 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-2 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;