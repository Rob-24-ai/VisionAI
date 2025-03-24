import { useState, useEffect, useCallback, useRef } from "react";

export function useSessionTimer() {
  const [time, setTime] = useState("0m 0s");
  const [isRunning, setIsRunning] = useState(false);
  const secondsRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  
  // Format seconds into "Xm Xs" format
  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }, []);
  
  // Start the timer
  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  // Stop the timer
  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  // Reset the timer
  const resetTimer = useCallback(() => {
    secondsRef.current = 0;
    setTime(formatTime(0));
    setIsRunning(false);
  }, [formatTime]);
  
  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        secondsRef.current += 1;
        setTime(formatTime(secondsRef.current));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, formatTime]);
  
  return { time, isRunning, startTimer, stopTimer, resetTimer };
}
