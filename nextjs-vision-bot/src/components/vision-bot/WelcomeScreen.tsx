'use client';

import { CameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStartSession: () => void;
}

export default function WelcomeScreen({ onStartSession }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-dark-900 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CameraIcon className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">
            Vision Bot
          </h1>
          
          <p className="text-gray-300 mb-6">
            An AI assistant that can see and understand your visual context. Ask questions about what you're looking at.
          </p>
          
          <div className="grid grid-cols-1 gap-3 text-left text-sm mb-8">
            <div className="bg-dark-800/50 p-3 rounded-lg border border-white/10">
              <h3 className="font-medium text-white mb-1">Show objects</h3>
              <p className="text-gray-400">Point your camera at objects and ask about them</p>
            </div>
            
            <div className="bg-dark-800/50 p-3 rounded-lg border border-white/10">
              <h3 className="font-medium text-white mb-1">Scan documents</h3>
              <p className="text-gray-400">Get information from documents, menus, and signs</p>
            </div>
            
            <div className="bg-dark-800/50 p-3 rounded-lg border border-white/10">
              <h3 className="font-medium text-white mb-1">Natural conversation</h3>
              <p className="text-gray-400">Have a back-and-forth dialog about what you see</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onStartSession} 
          className="w-full py-6 bg-primary hover:bg-primary/90 text-lg"
        >
          Get Started
        </Button>
        
        <p className="mt-4 text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy. Camera access is required.
        </p>
      </div>
    </div>
  );
}