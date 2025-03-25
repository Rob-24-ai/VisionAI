'use client';

import { useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useAudioLevels } from '@/hooks/useAudioLevels';

interface ControlsBarProps {
  isMicActive: boolean;
  onMicToggle: () => void;
}

export default function ControlsBar({ isMicActive, onMicToggle }: ControlsBarProps) {
  // Audio level for microphone visualization
  const { audioLevel, isActive, startMonitoring, stopMonitoring } = useAudioLevels({
    smoothingFactor: 0.7,
    minLevel: 0.05
  });
  
  // Start/stop audio monitoring based on mic state
  useEffect(() => {
    if (isMicActive) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
    
    return () => stopMonitoring();
  }, [isMicActive, startMonitoring, stopMonitoring]);
  
  // Calculate size of inner circle based on audio level
  const getInnerCircleSize = () => {
    // Base size when not speaking (40% of outer button)
    const minSize = 40;
    // Max growth when speaking loud (85% of outer button)
    const maxSize = 85;
    
    // Linear interpolation between min and max based on audio level
    const size = minSize + (maxSize - minSize) * audioLevel;
    return `${size}%`;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center z-10 pb-6 pointer-events-none">
      <div className="flex gap-4 items-center">
        {/* Microphone button with audio level visualization */}
        <button
          onClick={onMicToggle}
          className="relative w-12 h-12 flex items-center justify-center bg-primary rounded-full shadow-lg pointer-events-auto hover:bg-primary/90 active:scale-95 transition-all duration-200"
          aria-label={isMicActive ? "Mute microphone" : "Unmute microphone"}
        >
          {/* Outer ring (button background) */}
          <div className="absolute inset-0 rounded-full bg-primary"></div>
          
          {/* Inner circle (audio visualization) */}
          <div 
            className={`absolute rounded-full bg-white transition-all duration-100 ${
              isMicActive ? 'opacity-90' : 'opacity-0'
            }`}
            style={{ 
              width: getInnerCircleSize(), 
              height: getInnerCircleSize(),
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%'
            }}
          ></div>
          
          {/* Mic icon */}
          <div className="relative z-10">
            {isMicActive ? (
              <Mic className="h-6 w-6 text-white" />
            ) : (
              <MicOff className="h-6 w-6 text-white" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}