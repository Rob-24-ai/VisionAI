import { Loader2, WifiOff } from "lucide-react";

interface ConnectionModalProps {
  onCancel: () => void;
}

export default function ConnectionModal({ onCancel }: ConnectionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 text-white text-center">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
          
          <h2 className="text-xl font-medium">Connecting to AI Service</h2>
          <p className="text-gray-400 mt-2">
            Establishing a secure connection to the AI service.
            This might take a few moments.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <WifiOff className="w-4 h-4" />
            <span>Cancel Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
}