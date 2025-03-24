interface ControlsBarProps {
  isMicActive: boolean;
  onMicToggle: () => void;
}

export default function ControlsBar({ isMicActive, onMicToggle }: ControlsBarProps) {
  return (
    <div className="flex justify-center items-center pb-8 pt-2">
      <button 
        onClick={onMicToggle}
        className={`mic-button w-16 h-16 ${isMicActive ? 'bg-cyan-500' : 'bg-primary'} hover:bg-opacity-90 rounded-full flex items-center justify-center shadow-lg focus:outline-none transition-transform active:scale-95`}
      >
        {!isMicActive && (
          <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
