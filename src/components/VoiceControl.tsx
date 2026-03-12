'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, Waves, Radio } from 'lucide-react';

interface VoiceControlProps {
  onTranscript: (text: string) => void;
  lastResponse: string | null;
}

export default function VoiceControl({ onTranscript, lastResponse }: VoiceControlProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.start();
  };

  const playTTS = async () => {
    if (!lastResponse || isPlaying) return;

    setIsPlaying(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lastResponse }),
      });
      
      const data = await res.json();
      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.onended = () => setIsPlaying(false);
        audio.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
      <motion.button 
        whileHover={{ scale: 1.02, backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)' }}
        whileTap={{ scale: 0.98 }}
        onClick={startRecording}
        style={{ 
          background: isRecording ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.01)',
          border: isRecording ? '1px solid #ef4444' : '1px solid var(--border)',
          color: 'white',
          padding: '1.25rem',
          borderRadius: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ 
          background: isRecording ? '#ef4444' : 'rgba(255,255,255,0.05)',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isRecording ? 'white' : 'var(--primary)',
          boxShadow: isRecording ? '0 0 15px #ef4444' : 'none'
        }}>
          {isRecording ? <Radio size={20} className="animate-pulse" /> : <Mic size={20} />}
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>Voice Link</p>
          <p style={{ fontSize: '0.95rem' }}>{isRecording ? 'Capturing...' : 'Audio Input'}</p>
        </div>
      </motion.button>

      <motion.button 
        whileHover={lastResponse && !isPlaying ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.02)' } : {}}
        whileTap={lastResponse && !isPlaying ? { scale: 0.98 } : {}}
        onClick={playTTS}
        disabled={!lastResponse || isPlaying}
        style={{ 
          background: isPlaying ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255,255,255,0.01)',
          border: isPlaying ? '1px solid var(--primary)' : '1px solid var(--border)',
          color: lastResponse ? 'white' : 'var(--text-muted)',
          padding: '1.25rem',
          borderRadius: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontWeight: '600',
          cursor: !lastResponse || isPlaying ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ 
          background: isPlaying ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isPlaying ? 'black' : 'var(--primary)',
          boxShadow: isPlaying ? '0 0 15px var(--primary-glow)' : 'none'
        }}>
          {isPlaying ? <Waves size={20} /> : <Volume2 size={20} />}
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>Nova Voice</p>
          <p style={{ fontSize: '0.95rem' }}>{isPlaying ? 'Speaking...' : 'Read Response'}</p>
        </div>
      </motion.button>
    </div>
  );
}
