'use client';

import { Loader2 } from 'lucide-react';

interface ConnectionModalProps {
  onCancel: () => void;
}

export default function ConnectionModal({ onCancel }: ConnectionModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-sm w-full shadow-xl p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">Connecting to AI</h2>
          <p className="text-gray-300 text-sm mb-6">
            Establishing a secure connection to our AI art analysis service...
          </p>
          
          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-6">
            <div className="bg-primary h-1.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
          
          <div className="space-y-3 mb-6 w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Initializing AI models</span>
              <span className="text-xs text-green-400">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Establishing secure connection</span>
              <span className="text-xs text-green-400">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Preparing visual analysis</span>
              <span className="text-xs">
                <Loader2 className="h-3 w-3 text-primary animate-spin" />
              </span>
            </div>
          </div>
          
          <button 
            onClick={onCancel}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}