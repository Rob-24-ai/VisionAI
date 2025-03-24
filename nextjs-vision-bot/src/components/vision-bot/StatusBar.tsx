'use client';

import { XIcon, ClockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectionStatus } from '@/types/pipecat';

interface StatusBarProps {
  connectionStatus: ConnectionStatus;
  sessionTime: string;
  onEndSession: () => void;
}

export default function StatusBar({ connectionStatus, sessionTime, onEndSession }: StatusBarProps) {
  const getStatusText = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return '';
    }
  };
  
  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-20 p-2 flex justify-between items-center">
      <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
        <div className={cn("w-2 h-2 rounded-full", getStatusColor(connectionStatus))}></div>
        <span className="text-xs font-medium text-white">
          {getStatusText(connectionStatus)}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
          <ClockIcon className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-medium text-white">{sessionTime}</span>
        </div>
        
        <button
          onClick={onEndSession}
          className="bg-black/40 backdrop-blur-md p-1.5 rounded-full hover:bg-red-500/70 transition-colors"
          aria-label="End Session"
        >
          <XIcon className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}