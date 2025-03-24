'use client';

import { Camera, Mic, XCircle } from 'lucide-react';

interface PermissionsModalProps {
  onAllowPermissions: () => void;
  onCancel: () => void;
}

export default function PermissionsModal({ onAllowPermissions, onCancel }: PermissionsModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-sm w-full shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-1">Camera & Microphone Access</h2>
          <p className="text-gray-300 text-sm mb-6">
            This app needs access to your camera and microphone to provide real-time art analysis.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Camera</h3>
                <p className="text-gray-400 text-xs">
                  To see your artwork and provide visual analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Microphone</h3>
                <p className="text-gray-400 text-xs">
                  To enable voice conversation with the AI art critic
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onAllowPermissions}
              className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Allow Access
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-3 text-xs text-gray-400">
          <p>You can change these permissions later in your browser settings if needed.</p>
        </div>
      </div>
    </div>
  );
}