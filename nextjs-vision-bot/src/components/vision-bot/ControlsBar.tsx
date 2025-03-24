'use client';

import { MicIcon, MicOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlsBarProps {
  isMicActive: boolean;
  onMicToggle: () => void;
}

export default function ControlsBar({ isMicActive, onMicToggle }: ControlsBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center z-20 pb-8 pt-4">
      <div className="relative">
        <button
          onClick={onMicToggle}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-lg mic-button transition-all duration-300",
            isMicActive 
              ? "bg-primary text-white" 
              : "bg-white/10 text-white backdrop-blur-md border border-white/20"
          )}
          aria-label={isMicActive ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isMicActive ? (
            <>
              <MicIcon className="w-7 h-7" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full bg-primary/40 animate-ping opacity-75"></div>
              </div>
            </>
          ) : (
            <MicOffIcon className="w-7 h-7" />
          )}
        </button>
        
        {isMicActive && (
          <div className="absolute -right-6 top-1/2 -translate-y-1/2">
            <div className="volume-bars">
              <div className="volume-bar"></div>
              <div className="volume-bar"></div>
              <div className="volume-bar"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}