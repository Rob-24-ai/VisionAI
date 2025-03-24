import { Camera, Mic, AlertCircle } from "lucide-react";

interface PermissionsModalProps {
  onAllowPermissions: () => void;
  onCancel: () => void;
}

export default function PermissionsModal({ onAllowPermissions, onCancel }: PermissionsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 text-white">
        <div className="flex items-center gap-3 mb-4 text-yellow-400">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-xl font-medium">Camera & Mic Access</h2>
        </div>
        
        <p className="text-gray-300 mb-6">
          This app needs access to your camera and microphone to provide AI art feedback. 
          Your media is processed securely and remains on your device.
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
            <Camera className="w-5 h-5 text-indigo-400" />
            <span className="text-sm">Camera access for artwork analysis</span>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
            <Mic className="w-5 h-5 text-indigo-400" />
            <span className="text-sm">Microphone access for voice interactions</span>
          </div>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAllowPermissions}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            Allow Access
          </button>
        </div>
      </div>
    </div>
  );
}