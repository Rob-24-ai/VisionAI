interface ControlsBarProps {
  isMicActive: boolean;
  onMicToggle: () => void;
}

export default function ControlsBar({ isMicActive, onMicToggle }: ControlsBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center pb-8 pt-2">
      <button 
        onClick={onMicToggle}
        className={`mic-button w-16 h-16 ${isMicActive ? 'bg-violet-600' : 'bg-violet-600'} hover:bg-violet-700 rounded-full flex items-center justify-center shadow-lg focus:outline-none transition-all active:scale-95`}
        aria-label={isMicActive ? "Mute microphone" : "Unmute microphone"}
      >
        {!isMicActive && (
          <svg className="w-7 h-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
        
        {isMicActive && (
          <div className="volume-bars">
            <div className="volume-bar"></div>
            <div className="volume-bar"></div>
            <div className="volume-bar"></div>
          </div>
        )}
      </button>
    </div>
  );
}
