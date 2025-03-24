'use client';

import { Mic, MicOff } from 'lucide-react';
import { useAudioLevels } from '@/hooks/useAudioLevels';

interface ControlsBarProps {
  isMicActive: boolean;
  onMicToggle: () => void;
}

export default function ControlsBar({ isMicActive, onMicToggle }: ControlsBarProps) {
  // Use our audio levels hook to get real-time audio levels when the mic is active
  const { level: voiceLevel } = useAudioLevels({
    enabled: isMicActive,
    smoothingFactor: 0.3,
    minLevel: 0.1
  });
  
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center items-center z-30">
      <button
        onClick={onMicToggle}
        className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg"
        aria-label={isMicActive ? "Mute microphone" : "Unmute microphone"}
      >
        {/* Voice level indicator - inner circle that changes size based on voice level */}
        {isMicActive && (
          <div 
            className="absolute rounded-full bg-white transition-all duration-75"
            style={{
              width: `${Math.max(40, 40 + (voiceLevel * 20))}px`,
              height: `${Math.max(40, 40 + (voiceLevel * 20))}px`,
              opacity: 0.2 + (voiceLevel * 0.3)
            }}
          ></div>
        )}
        
        {/* Secondary pulse animation for visual feedback */}
        {isMicActive && (
          <div 
            className="absolute rounded-full bg-white animate-ping"
            style={{
              width: '40px',
              height: '40px',
              opacity: 0.1,
              animationDuration: '2s'
            }}
          ></div>
        )}
        
        {/* Mic icon */}
        {isMicActive ? (
          <Mic className="w-7 h-7 text-white" />
        ) : (
          <MicOff className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
}