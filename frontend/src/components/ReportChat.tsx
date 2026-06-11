"use client";

import React, { useState } from 'react';

interface ReportChatProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reportData: any;
}

export function ReportChat({ reportData }: ReportChatProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Report Query Assistant. Please submit any queries regarding the findings or source materials." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report: reportData,
          message: userMessage
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get a response');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `An unknown error occurred` }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-100 flex flex-col h-[700px]">
      <div className="p-6 border-b-2 border-slate-900 dark:border-slate-100 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
        <h3 className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Interactive Q&A</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100 dark:bg-slate-900">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-5 border-2 ${
                msg.role === 'user' 
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100' 
                  : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-900 dark:border-slate-100'
              }`}
            >
              <p className="text-base font-bold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-100 p-4 flex items-center gap-4">
              <span className="text-sm font-mono animate-pulse text-slate-900 dark:text-slate-100 font-bold">[||||||  ]</span>
              <span className="text-sm font-mono font-bold uppercase text-slate-700 dark:text-slate-300">Retrieving insights...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-950">
        <form onSubmit={sendMessage} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Submit a query..."
            className="flex-1 px-5 py-4 bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-900 dark:focus:ring-slate-100 text-base font-bold text-slate-900 dark:text-slate-100 placeholder-slate-500"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="px-6 py-4 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 text-white dark:text-slate-900 text-sm font-mono uppercase font-black transition-colors border-2 border-slate-900 dark:border-slate-100"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
