import { Mic, MicOff } from 'lucide-react';

interface ControlsBarProps {
  isMicActive: boolean;
  onMicToggle: () => void;
  audioLevel?: number; // 0-1 value for audio visualization
}

export default function ControlsBar({ isMicActive, onMicToggle, audioLevel = 0 }: ControlsBarProps) {
  // Calculate inner circle scale based on audio level
  const getInnerScale = () => {
    // Base minimum size (20%) + audio level influence (up to 80%)
    return 0.2 + (audioLevel * 0.8);
  };
  
  return (
    <button
      onClick={onMicToggle}
      className={`relative rounded-full p-1 flex items-center justify-center transition-colors duration-200 shadow-lg ${
        isMicActive 
          ? 'bg-indigo-600 hover:bg-indigo-700' 
          : 'bg-gray-700 hover:bg-gray-600'
      }`}
      aria-label={isMicActive ? 'Mute microphone' : 'Unmute microphone'}
    >
      {/* Outer fixed circle */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center">
        {isMicActive ? (
          <Mic className="w-4 h-4 text-white" />
        ) : (
          <MicOff className="w-4 h-4 text-white" />
        )}
        
        {/* Inner animated circle for audio visualization */}
        {isMicActive && (
          <div 
            className="absolute inset-0 rounded-full bg-indigo-400 opacity-50 transition-transform duration-75"
            style={{ 
              transform: `scale(${getInnerScale()})`,
              transformOrigin: 'center'
            }}
          />
        )}
      </div>
    </button>
  );
}