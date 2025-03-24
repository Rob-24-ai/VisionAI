'use client';

import { WifiIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ConnectionModalProps {
  onCancel: () => void;
}

export default function ConnectionModal({ onCancel }: ConnectionModalProps) {
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [connectingText, setConnectingText] = useState('Connecting to AI service...');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (connectionAttempts < 3) {
        setConnectionAttempts(prev => prev + 1);
        
        if (connectionAttempts === 0) {
          setConnectingText('Initializing secure connection...');
        } else if (connectionAttempts === 1) {
          setConnectingText('Authenticating with Pipecat Cloud...');
        } else {
          setConnectingText('Almost there, preparing vision model...');
        }
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [connectionAttempts]);
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-lg max-w-md w-full mx-auto p-6 border border-white/10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <WifiIcon className="w-8 h-8 text-primary animate-pulse" />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">
            Connecting to AI Service
          </h2>
          
          <p className="text-gray-300 text-sm mb-4">
            Establishing connection to the AI vision service. This may take a moment...
          </p>
          
          <div className="w-full bg-dark-900 rounded-full h-2 mb-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${(connectionAttempts + 1) * 25}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-primary">
            {connectingText}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="w-full border-white/10 hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}