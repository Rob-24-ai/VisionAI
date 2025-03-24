'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface UseAudioLevelsOptions {
  smoothingFactor?: number; // Between 0 and 1, higher values mean smoother transitions
  minLevel?: number; // Minimum level to return (0-1)
  enabled?: boolean; // Whether to capture audio levels
}

export function useAudioLevels(options: UseAudioLevelsOptions = {}) {
  const {
    smoothingFactor = 0.5,
    minLevel = 0.05,
    enabled = true,
  } = options;

  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousLevelRef = useRef<number>(0);
  
  // Start audio level monitoring
  const startMonitoring = useCallback(async () => {
    if (!enabled) return;
    
    try {
      if (!audioContextRef.current) {
        // Create audio context
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Create analyzer
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = smoothingFactor;
      
      // Connect stream to analyzer
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyserRef.current = analyser;
      setIsActive(true);
      
      // Start capturing levels
      captureAudioLevels();
    } catch (error) {
      console.error('Failed to start audio monitoring:', error);
      setIsActive(false);
    }
  }, [enabled, smoothingFactor]);
  
  // Stop audio level monitoring
  const stopMonitoring = useCallback(() => {
    // Stop animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Stop microphone stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Reset state
    setIsActive(false);
    setAudioLevel(0);
    previousLevelRef.current = 0;
  }, []);
  
  // Capture and process audio levels
  const captureAudioLevels = useCallback(() => {
    if (!analyserRef.current || !isActive) return;
    
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateLevels = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average level
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      
      // Normalize to 0-1
      const avg = sum / dataArray.length / 255;
      
      // Apply smoothing with the previous level
      const smoothedLevel = previousLevelRef.current * smoothingFactor + avg * (1 - smoothingFactor);
      const finalLevel = Math.max(smoothedLevel, minLevel);
      
      previousLevelRef.current = smoothedLevel;
      setAudioLevel(finalLevel);
      
      // Continue capturing
      animationFrameRef.current = requestAnimationFrame(updateLevels);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateLevels);
  }, [isActive, smoothingFactor, minLevel]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopMonitoring]);
  
  return {
    audioLevel,
    isActive,
    startMonitoring,
    stopMonitoring
  };
}