'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Good day. I am the VersionLabs Virtual Liaison. How may I assist you with your digital infrastructure or national LMS requirements today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg,
          history: history
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'model', text: data.text || 'I apologize, but I am unable to process that request at the moment.' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'An error occurred. Please try again shortly.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-[100] font-sans">
      {!isOpen && (
        <div className="relative group flex items-center justify-end">
          {/* Label that slides out on hover */}
          <div className="mr-4 px-6 py-2 bg-white border border-accent/20 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500 pointer-events-none shadow-lg">
            <span className="text-base font-black uppercase tracking-ultra text-accent whitespace-nowrap">Request Liaison</span>
          </div>

          {/* New Circular Trigger */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-16 h-16 bg-white border border-accent/40 flex items-center justify-center text-accent transition-all duration-500 shadow-[0_10px_30px_rgba(79,193,198,0.1)] group-hover:shadow-[0_20px_50px_rgba(79,193,198,0.2)] group-hover:border-accent group-hover:scale-105 overflow-visible"
          >
            {/* Pulsing Aura */}
            <div className="absolute inset-0 bg-accent/10 animate-ping opacity-40 group-hover:opacity-40"></div>
            
            <svg className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="bg-white w-[450px] h-[650px] shadow-[0_40px_150px_rgba(0,0,0,0.15)] flex flex-col border border-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-700 rounded-lg overflow-hidden">
          <div className="bg-slate-50 p-8 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-accent text-white flex items-center justify-center text-base font-black">VL</div>
              <div>
                <p className="font-display font-black text-obsidian-900 text-base uppercase tracking-ultra">Assistant Liaison</p>
                <p className="text-base font-black text-accent uppercase tracking-ultra opacity-60">Sovereign Secure Channel</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-accent transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-white">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-6 text-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-accent text-white font-black tracking-tight shadow-md' 
                  : 'bg-slate-50 text-slate-700 border border-slate-100 font-light'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-1 opacity-50">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center bg-white border border-slate-200 p-2 group focus-within:border-accent/50 transition-all rounded-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Inquire about VersionLabs systems..."
                className="flex-1 text-sm bg-transparent border-none focus:ring-0 focus:outline-none placeholder-slate-300 text-obsidian-900 px-4"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-accent text-white p-4 hover:bg-obsidian-900 disabled:opacity-50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
