'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Shield, Cpu, Zap, Activity } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    icon: <Cpu size={18} />,
    q: "How does NovaDoc work?",
    a: "NovaDoc utilizes the Amazon Nova 2 Lite engine for vision-to-text analysis and Nova 2 Sonic for zero-latency voice synthesis."
  },
  {
    icon: <Shield size={18} />,
    q: "Protocol Security?",
    a: "All medical data is processed via HIPAA-standard encrypted channels within AWS Bedrock. No patient data is stored locally."
  },
  {
    icon: <Zap size={18} />,
    q: "Supported Diagnostics?",
    a: "The system analyzes radiology reports, laboratory results (PDF), clinical scans (MRI, CT, X-ray), and handwritten prescriptions (JPG/PNG)."
  },
  {
    icon: <HelpCircle size={18} />,
    q: "Clinical Validity?",
    a: "NovaDoc is an advanced analytical assistant. It provides expert terminology explanation but is NOT a substitute for professional clinical diagnosis."
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sidebar-overlay"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="sidebar"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Activity size={24} className="accent-glow" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Clinical <span style={{ color: 'var(--primary)' }}>Center</span></h2>
              </div>
              <button 
                onClick={onClose}
                style={{ color: 'var(--text-muted)', padding: '0.5rem', borderRadius: '50%', display: 'flex', border: '1px solid var(--border)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Access professional guidance and system protocols for NovaDoc intelligence.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {faqs.map((faq, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="faq-item"
                >
                  <div className="faq-question" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {faq.icon} {faq.q}
                  </div>
                  <div className="faq-answer">{faq.a}</div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '1.25rem', border: '1px solid var(--glass-border)' }}>
              <p style={{ fontSize: '0.85rem', color: 'white', textAlign: 'center', fontWeight: 500 }}>
                Enterprise Grade Medical Intelligence
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.25rem' }}>
                Powered by Amazon Bedrock
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
