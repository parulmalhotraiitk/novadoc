'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, FileUp, ShieldCheck } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File, base64: string) => void;
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onFileSelect(file, base64);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel"
      style={{ 
        padding: '2rem', 
        display: 'flex',
        flexDirection: 'column'
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
          <FileText size={22} className="accent-glow" /> 
          Medical Protocol
        </h2>
        <ShieldCheck size={20} color="var(--primary)" style={{ opacity: 0.6 }} />
      </div>

      <label style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed',
        borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
        borderRadius: '1.25rem',
        padding: '3rem 2rem',
        cursor: 'pointer',
        background: isDragging ? 'rgba(56, 189, 248, 0.05)' : 'rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <input type="file" style={{ display: 'none' }} onChange={onFileChange} accept="image/*,application/pdf" />
        
        <motion.div
          animate={{ y: isDragging ? -10 : 0 }}
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '16px', 
            background: isDragging ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: isDragging ? 'black' : 'var(--primary)',
            boxShadow: isDragging ? '0 0 20px var(--primary-glow)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <FileUp size={32} />
        </motion.div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'white' }}>
            {fileName ? fileName : 'Upload Clinical Data'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Interactive scan for PDF, JPG, PNG
          </p>
        </div>
      </label>

      {fileName && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            marginTop: '1.5rem', 
            padding: '1rem 1.25rem', 
            background: 'rgba(16, 185, 129, 0.05)', 
            borderRadius: '1rem', 
            border: '1px solid rgba(16, 185, 129, 0.2)', 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center' 
          }}
        >
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: '#10b981', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <CheckCircle size={18} color="black" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700 }}>VERIFIED</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scan initiated via Nova AI Secure Channel</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
