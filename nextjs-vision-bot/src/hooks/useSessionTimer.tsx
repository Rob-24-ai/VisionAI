import { useState, useEffect } from 'react';

export function useSessionTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Format seconds to mm:ss
  const formattedTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    seconds,
    isActive,
    formattedTime: formattedTime(),
    startTimer: () => setIsActive(true),
    pauseTimer: () => setIsActive(false),
    resetTimer: () => {
      setSeconds(0);
      setIsActive(true);
    }
  };
}