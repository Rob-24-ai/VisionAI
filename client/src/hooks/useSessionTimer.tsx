import { useState, useEffect, useCallback } from 'react';

export function useSessionTimer() {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // Format time as MM:SS
  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Timer controls
  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  const resetTimer = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
  }, []);
  
  // Update timer every second when running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  return {
    time: formatTime(seconds),
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formattedTime: formatTime(seconds),
    pauseTimer: stopTimer  // Alias for consistency with some APIs
  };
}