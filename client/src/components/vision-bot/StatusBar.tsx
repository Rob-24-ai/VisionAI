import { WifiIcon, Clock, XCircle } from 'lucide-react';
import { ConnectionStatus } from '../../types/pipecat';

interface StatusBarProps {
  connectionStatus: ConnectionStatus;
  sessionTime: string;
  onEndSession: () => void;
}

export default function StatusBar({ connectionStatus, sessionTime, onEndSession }: StatusBarProps) {
  // Helper function to get status text
  const getStatusText = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-gray-400';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm text-white z-10">
      {/* Connection status */}
      <div className="flex items-center gap-2">
        <WifiIcon className={`w-4 h-4 ${getStatusColor(connectionStatus)}`} />
        <span className="text-xs font-medium">{getStatusText(connectionStatus)}</span>
      </div>
      
      {/* Session timer */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-300" />
        <span className="text-xs font-medium">{sessionTime}</span>
      </div>
      
      {/* End session button */}
      <button
        onClick={onEndSession}
        className="flex items-center gap-1 text-xs font-medium text-gray-300 hover:text-white transition-colors"
        aria-label="End session"
      >
        <XCircle className="w-4 h-4" />
        <span>End</span>
      </button>
    </div>
  );
}