'use client';

import { Camera, Video } from 'lucide-react';

interface WelcomeScreenProps {
  onStartSession: () => void;
}

export default function WelcomeScreen({ onStartSession }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Logo/Icon */}
        <div className="mb-8 bg-primary/20 p-6 rounded-full">
          <Camera className="h-16 w-16 text-primary" />
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-3xl font-bold mb-4 text-center">AI Art Critic</h1>
        <p className="text-center text-gray-300 mb-8">
          Point your camera at any artwork and get real-time expert analysis and feedback.
        </p>
        
        {/* Features */}
        <div className="w-full mb-8 space-y-3">
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg">
            <div className="bg-primary/20 p-2 rounded-full">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm">Real-time camera analysis</p>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg">
            <div className="bg-primary/20 p-2 rounded-full">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm">Expert art critique and feedback</p>
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
        <p className="text-xs text-gray-400 mt-6 text-center">
          Camera access is required. Your session data is processed securely.
        </p>
      </div>
    </div>
  );
}