'use client';

import { useState, useEffect, useCallback } from 'react';

export function useSessionTimer() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [formattedTime, setFormattedTime] = useState<string>('00:00');
  
  // Start the timer
  const startTimer = useCallback(() => {
    setStartTime(Date.now() - elapsedTime);
    setIsRunning(true);
  }, [elapsedTime]);
  
  // Pause the timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  // Reset the timer
  const resetTimer = useCallback(() => {
    setStartTime(null);
    setElapsedTime(0);
    setIsRunning(false);
    setFormattedTime('00:00');
  }, []);
  
  // Format time as MM:SS
  const formatTime = useCallback((timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Update the timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isRunning && startTime !== null) {
      interval = setInterval(() => {
        const currentElapsed = Date.now() - startTime;
        setElapsedTime(currentElapsed);
        setFormattedTime(formatTime(currentElapsed));
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, formatTime]);
  
  return {
    isRunning,
    elapsedTime,
    formattedTime,
    startTimer,
    pauseTimer,
    resetTimer
  };
}