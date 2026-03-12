'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Loader2, Sparkles, Stethoscope } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  onResetChat: () => void;
  messages: Message[];
  isLoading: boolean;
}

export default function ChatInterface({ onSendMessage, onResetChat, messages, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel chat-panel" 
      style={{ 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column',
        height: '650px',
        position: 'relative'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Stethoscope size={26} className="accent-glow" /> 
          Medical <span style={{ color: 'var(--primary)' }}>Assistant</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.button
            whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.08)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetChat}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--border)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={14} /> NEW CHAT
          </motion.button>
          
          <div style={{ 
            background: 'rgba(56, 189, 248, 0.05)', 
            padding: '0.4rem 1rem', 
            borderRadius: '2rem', 
            fontSize: '0.75rem', 
            color: 'var(--primary)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
            LIVE ANALYTICS
          </div>
        </div>
      </div>
      
      <div className="scrollbar-hide" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        marginBottom: '1.5rem', 
        paddingRight: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {messages.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ marginBottom: '1.5rem', opacity: 0.3 }}>
                 <MessageSquare size={56} style={{ margin: '0 auto' }} />
              </div>
              <p style={{ fontWeight: 600, color: 'white', fontSize: '1.1rem' }}>Awaiting Medical Inquiry</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: '300px' }}>"Provide a detailed clinical summary of the uploaded medical documents."</p>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ 
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  gap: '1rem',
                  flexDirection: m.role === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  minWidth: '36px',
                  borderRadius: '10px', 
                  background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)',
                  boxShadow: m.role === 'user' ? '0 0 15px var(--primary-glow)' : 'none'
                }}>
                  {m.role === 'user' ? <User size={20} color="black" /> : <Sparkles size={20} color="var(--primary)" />}
                </div>
                <div style={{ 
                  padding: '1rem 1.25rem',
                  borderRadius: '1.25rem',
                  background: m.role === 'user' ? 'linear-gradient(135deg, var(--primary), #0ea5e9)' : 'rgba(30, 41, 59, 0.4)',
                  color: m.role === 'user' ? 'black' : 'white',
                  fontWeight: m.role === 'user' ? 600 : 400,
                  border: '1px solid var(--border)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ alignSelf: 'flex-start', display: 'flex', gap: '1rem', alignItems: 'center' }}
          >
            <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                background: 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)'
              }}>
              <Loader2 size={18} style={{ animation: 'spin 2s linear infinite', color: 'var(--primary)' }} />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
              Synthesizing medical intelligence...
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        background: 'rgba(0, 0, 0, 0.3)', 
        padding: '0.6rem', 
        borderRadius: '1.25rem', 
        border: '1px solid var(--border)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
      }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Consult with NovaDoc AI..." 
          style={{ 
            flex: 1, 
            padding: '1rem 1.25rem', 
            borderRadius: '1rem', 
            background: 'transparent', 
            border: 'none',
            color: 'white',
            outline: 'none',
            fontSize: '1rem'
          }} 
          disabled={isLoading}
        />
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px var(--primary-glow)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{ 
            background: isLoading || !input.trim() ? 'rgba(255,255,255,0.05)' : 'var(--primary)', 
            color: 'white', 
            padding: '0 1.5rem',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 800,
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}
        >
          <Send size={22} style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' }} />
        </motion.button>
      </div>
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
