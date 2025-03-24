interface WelcomeScreenProps {
  onStartSession: () => void;
}

export default function WelcomeScreen({ onStartSession }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col items-center justify-center z-50 p-6">
      <div className="max-w-xs w-full mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Vision Bot</h1>
          <p className="text-gray-400 text-sm">An AI assistant that can see, hear, and talk with you.</p>
        </div>
        
        <button 
          onClick={onStartSession}
          className="w-full bg-primary py-3 rounded-lg text-white font-medium mb-4"
        >
          Start Conversation
        </button>
        
        <div className="text-xs text-gray-500 mt-8">
          <p>Powered by Pipecat Cloud & Anthropic Claude</p>
        </div>
      </div>
    </div>
  );
}
