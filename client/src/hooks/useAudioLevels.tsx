import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAudioLevelsOptions {
  smoothingFactor?: number; // Between 0 and 1, higher values mean smoother transitions
  minLevel?: number; // Minimum level to return (0-1)
  enabled?: boolean; // Whether to capture audio levels
}

export function useAudioLevels(options: UseAudioLevelsOptions = {}) {
  const { 
    smoothingFactor = 0.5, 
    minLevel = 0.05,
    enabled = true
  } = options;
  
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Set up audio analysis
  const startCapturing = useCallback(async () => {
    if (!enabled) return;
    
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = smoothingFactor;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Start analyzing audio levels
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average level (0-255)
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        
        // Normalize to 0-1 range and apply minimum threshold
        const normalizedLevel = Math.max(average / 255, minLevel);
        
        setAudioLevel(normalizedLevel);
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error capturing audio for level visualization:', error);
    }
  }, [enabled, minLevel, smoothingFactor]);
  
  // Clean up
  const stopCapturing = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);
  
  useEffect(() => {
    if (enabled) {
      startCapturing();
    }
    
    return () => {
      stopCapturing();
    };
  }, [enabled, startCapturing, stopCapturing]);
  
  return {
    audioLevel,
    startCapturing,
    stopCapturing
  };
}