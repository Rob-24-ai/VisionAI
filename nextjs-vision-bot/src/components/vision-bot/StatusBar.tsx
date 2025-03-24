'use client';

import { XIcon } from 'lucide-react';
import { ConnectionStatus } from '@/types/pipecat';
import PersonaSelector from './PersonaSelector';

interface StatusBarProps {
  connectionStatus: ConnectionStatus;
  sessionTime: string;
  onEndSession: () => void;
}

export default function StatusBar({ connectionStatus, sessionTime, onEndSession }: StatusBarProps) {
  // Get status text and color based on connection status
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
  
  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500 animate-pulse';
      case 'disconnected':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2 bg-black/40 backdrop-blur-md border-b border-white/10">
      {/* Connection status indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(connectionStatus)}`}></div>
          <span className="text-xs text-gray-300">{getStatusText(connectionStatus)}</span>
        </div>
        <div className="text-xs text-gray-400 ml-2">{sessionTime}</div>
      </div>
      
      {/* Center - Persona selector */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <PersonaSelector compact />
      </div>
      
      {/* End session button */}
      <button
        onClick={onEndSession}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/30"
        aria-label="End session"
      >
        <XIcon className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
}