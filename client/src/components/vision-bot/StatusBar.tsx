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
    <div className="w-full flex items-center justify-between text-white">
      {/* Connection status */}
      <div className="flex items-center gap-1">
        <WifiIcon className={`w-3 h-3 ${getStatusColor(connectionStatus)}`} />
        <span className="text-[10px]">{getStatusText(connectionStatus)}</span>
      </div>
      
      {/* Session timer */}
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3 text-gray-300" />
        <span className="text-[10px]">{sessionTime}</span>
      </div>
      
      {/* End session button */}
      <button
        onClick={onEndSession}
        className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-white transition-colors"
        aria-label="End session"
      >
        <XCircle className="w-3 h-3" />
        <span>End</span>
      </button>
    </div>
  );
}