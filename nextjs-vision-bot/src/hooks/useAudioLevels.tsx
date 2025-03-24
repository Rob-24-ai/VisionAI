'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioLevelsOptions {
  smoothingFactor?: number; // Between 0 and 1, higher values mean smoother transitions
  minLevel?: number; // Minimum level to return (0-1)
  enabled?: boolean; // Whether to capture audio levels
}

export function useAudioLevels(options: UseAudioLevelsOptions = {}) {
  const {
    smoothingFactor = 0.3,
    minLevel = 0.1,
    enabled = false
  } = options;
  
  const [level, setLevel] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  // Initialize or clean up audio context based on enabled state
  useEffect(() => {
    if (enabled) {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContext();
        } catch (error) {
          console.error('AudioContext not supported:', error);
        }
      }
      
      // Request microphone access
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
          mediaStreamRef.current = stream;
          
          if (audioContextRef.current) {
            // Create analyzer
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            analyserRef.current.smoothingTimeConstant = 0.8;
            
            // Connect microphone to analyzer
            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);
            
            // Create data array for analyzing
            const bufferLength = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);
            
            // Start analyzing
            requestAnimationFrame(analyzeAudio);
          }
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    } else {
      // Clean up resources when disabled
      cleanupAudio();
    }
    
    return () => {
      cleanupAudio();
    };
  }, [enabled]);
  
  // Function to analyze audio and update level
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current || !enabled) {
      return;
    }
    
    // Get frequency data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Calculate average level
    let sum = 0;
    const length = dataArrayRef.current.length;
    
    for (let i = 0; i < length; i++) {
      sum += dataArrayRef.current[i];
    }
    
    // Convert to a value between 0 and 1
    const rawLevel = sum / (length * 255);
    const normalizedLevel = Math.max(minLevel, rawLevel);
    
    // Apply smoothing
    setLevel(prev => {
      return prev + (normalizedLevel - prev) * smoothingFactor;
    });
    
    // Continue analyzing
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [enabled, minLevel, smoothingFactor]);
  
  // Clean up audio resources
  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Disconnect source
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    // Stop all tracks in the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    
    setLevel(0);
  }, []);
  
  return {
    level,
    isCapturing: enabled && !!analyserRef.current
  };
}