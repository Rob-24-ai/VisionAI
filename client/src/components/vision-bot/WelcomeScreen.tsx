import { Camera, Mic } from 'lucide-react';
import { usePersona } from '../../contexts/PersonaContext';

interface WelcomeScreenProps {
  onStartSession: () => void;
}

export default function WelcomeScreen({ onStartSession }: WelcomeScreenProps) {
  const { currentPersona } = usePersona();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Art Critic AI</h1>
          <p className="text-lg text-gray-400">
            Get expert feedback on your artwork
          </p>
        </div>
        
        {/* Current Expert */}
        <div className="bg-gray-900 rounded-lg p-6 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentPersona.avatarColor }}
            >
              <span className="text-white font-bold text-lg">
                {currentPersona.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="font-medium text-lg">{currentPersona.name}</h2>
              <p className="text-sm text-gray-400">{currentPersona.title}</p>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed text-gray-300">
            {currentPersona.description}
          </p>
        </div>
        
        {/* How it works */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg flex items-start gap-3">
              <div className="bg-indigo-600 rounded-full p-2 mt-1">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Show your artwork</h3>
                <p className="text-sm text-gray-400">Position your camera to frame your artwork clearly</p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 p-4 rounded-lg flex items-start gap-3">
              <div className="bg-indigo-600 rounded-full p-2 mt-1">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Ask questions</h3>
                <p className="text-sm text-gray-400">Speak clearly to get detailed insights about your art</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Start button */}
        <button
          onClick={onStartSession}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors duration-200"
        >
          Start Session
        </button>
        
        <p className="text-xs text-gray-500 mt-4">
          Camera and microphone access required. All media stays on your device.
        </p>
      </div>
    </div>
  );
}