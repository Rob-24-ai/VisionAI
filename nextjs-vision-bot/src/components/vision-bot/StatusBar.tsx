'use client';

import { X, Wifi, WifiOff } from 'lucide-react';
import { ConnectionStatus } from '@/types/pipecat';

interface StatusBarProps {
  connectionStatus: ConnectionStatus;
  sessionTime: string;
  onEndSession: () => void;
}

export default function StatusBar({ connectionStatus, sessionTime, onEndSession }: StatusBarProps) {
  // Get appropriate status text based on connection status
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
        return 'Unknown Status';
    }
  };
  
  // Get appropriate status color based on connection status
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
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-2 bg-black/30 backdrop-blur-sm z-10">
      {/* Connection status */}
      <div className="flex items-center space-x-2">
        <div className={`h-2 w-2 rounded-full ${getStatusColor(connectionStatus)}`}></div>
        <span className="text-xs text-white">
          {getStatusText(connectionStatus)}
        </span>
      </div>
      
      {/* Session time */}
      <div className="text-sm font-mono text-white">
        {sessionTime}
      </div>
      
      {/* End button */}
      <button
        onClick={onEndSession}
        className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800/70 hover:bg-red-600/70 transition-colors duration-200"
        aria-label="End session"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}