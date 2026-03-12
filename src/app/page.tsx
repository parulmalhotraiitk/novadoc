'use client';

import React, { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import ChatInterface from '@/components/ChatInterface';
import VoiceControl from '@/components/VoiceControl';
import Sidebar from '@/components/Sidebar';
import { Menu, Activity, Stethoscope, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [file, setFile] = useState<{ name: string; type: string; base64: string } | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const [hasMounted, setHasMounted] = useState(false);

  React.useEffect(() => {
    setHasMounted(true);
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setFile(null);
  };

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: text }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          base64Image: file?.base64,
          fileName: file?.name,
          fileType: file?.type,
        }),
      });

      const data = await response.json();
      if (data.answer) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Failed to connect to Nova AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasMounted) return null;

  return (
    <>
      <button 
        className="hamburger" 
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Toggle Menu"
      >
        <Menu size={22} />
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="container">
        {/* Dynamic Background Element */}
        <div className="bg-glow" />

        <header className="main-header">
          {/* PWA Install Button */}
          <AnimatePresence>
            {installPrompt && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleInstallClick}
                style={{
                  position: 'absolute',
                  top: '-1rem',
                  right: '0',
                  background: 'var(--primary)',
                  color: 'black',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 0 20px var(--primary-glow)',
                  cursor: 'pointer',
                  border: 'none',
                  zIndex: 10
                }}
              >
                <Sparkles size={16} /> INSTALL APP
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="logo-container"
          >
            <div className="logo-icon">
              <Stethoscope size={26} />
            </div>
            <span className="logo-text">NovaDoc<span style={{ color: 'var(--primary)' }}>.</span></span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              background: 'rgba(56, 189, 248, 0.1)', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '2rem', 
              marginBottom: '1.25rem', 
              border: '1px solid var(--glass-border)' 
            }}
          >
            <Activity size={16} className="accent-glow" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--primary)' }}>AI-POWERED MEDICAL INTELLIGENCE</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="title-gradient"
            style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-muted)', textAlign: 'center', maxWidth: '600px', lineHeight: '1.6' }}
          >
            Sophisticated document analysis and real-time medical consultation using <span style={{ color: 'white', fontWeight: 700 }}>Amazon Nova AI</span>.
          </motion.h1>
        </header>

        <div className="grid-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <FileUploader onFileSelect={(f, b64) => setFile({ name: f.name, type: f.type, base64: b64 })} />
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel" 
              style={{ padding: '2rem' }}
            >
               <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Sparkles size={22} className="accent-glow" /> Protocol Status
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <StatusItem label="Analysis Engine" status="Nova 2 Lite" sub="Active" />
                 <StatusItem label="Synthesis Engine" status="Nova 2 Sonic" sub="Active" />
                 <StatusItem label="Data Security" status="AES-256 GCM" sub="Encrypted" />
               </div>
            </motion.div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ChatInterface 
              messages={messages} 
              isLoading={isLoading} 
              onSendMessage={handleSendMessage} 
              onResetChat={handleResetChat}
            />
            <VoiceControl 
              onTranscript={handleSendMessage} 
              lastResponse={messages.length > 0 && messages[messages.length-1].role === 'assistant' ? messages[messages.length-1].content : null} 
            />
          </div>
        </div>
      </main>
    </>
  );
}

function StatusItem({ label, status, sub }: { label: string, status: string, sub: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.1rem' }}>{label}</p>
        <p style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>{status}</p>
      </div>
      <div style={{ 
        background: 'rgba(16, 185, 129, 0.1)', 
        padding: '0.3rem 0.75rem', 
        borderRadius: '0.5rem', 
        fontSize: '0.75rem', 
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        fontWeight: 600
      }}>
        {sub}
      </div>
    </div>
  );
}
