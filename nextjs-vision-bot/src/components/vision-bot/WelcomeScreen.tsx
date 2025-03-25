'use client';

import { Camera, Video } from 'lucide-react';

interface WelcomeScreenProps {
  onStartSession: () => void;
}

export default function WelcomeScreen({ onStartSession }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-gray-900 to-black text-white p-4 overflow-y-auto">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Logo/Icon */}
        <div className="mb-4 bg-primary/20 p-4 rounded-full">
          <Camera className="h-12 w-12 text-primary" />
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-2xl font-bold mb-2 text-center">AI Art Critic</h1>
        <p className="text-center text-gray-300 mb-4 text-sm">
          Point your camera at any artwork and get real-time expert analysis and feedback.
        </p>
        
        {/* Features */}
        <div className="w-full mb-4 space-y-2">
          <div className="flex items-center space-x-3 bg-white/5 p-2 rounded-lg">
            <div className="bg-primary/20 p-1.5 rounded-full">
              <Camera className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs">Real-time camera analysis</p>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/5 p-2 rounded-lg">
            <div className="bg-primary/20 p-1.5 rounded-full">
              <Video className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs">Expert art critique and feedback</p>
          </div>
        </div>
        
        {/* Start Button */}
        <button
          onClick={onStartSession}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-3 font-semibold transition-colors duration-200 active:scale-95 transform"
        >
          Start Session
        </button>
        
        {/* Privacy note */}
        <p className="text-xs text-gray-400 mt-3 text-center">
          Camera access is required. Your session data is processed securely.
        </p>
      </div>
    </div>
  );
}