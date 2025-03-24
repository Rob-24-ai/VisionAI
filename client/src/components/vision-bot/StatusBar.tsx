import { ConnectionStatus } from "@/types/pipecat";

interface StatusBarProps {
  connectionStatus: ConnectionStatus;
  sessionTime: string;
  onEndSession: () => void;
}

export default function StatusBar({ connectionStatus, sessionTime, onEndSession }: StatusBarProps) {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "error":
        return "Connection Error";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="w-full bg-dark-800 flex justify-between items-center px-4 py-2 h-12">
      <div className="text-xs font-medium flex items-center gap-2">
        <span className="flex items-center gap-1">
          <span className={`h-2 w-2 rounded-full ${getStatusColor()} ${connectionStatus === "connecting" ? "animate-pulse" : ""}`}></span>
          <span>{getStatusText()}</span>
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium">{sessionTime}</span>
        {connectionStatus === "connected" && (
          <button 
            onClick={onEndSession}
            className="text-red-500 text-xs font-medium"
          >
            End
          </button>
        )}
      </div>
    </div>
  );
}
