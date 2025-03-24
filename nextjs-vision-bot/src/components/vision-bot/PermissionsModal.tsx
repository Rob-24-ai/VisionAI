'use client';

import { CameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PermissionsModalProps {
  onAllowPermissions: () => void;
  onCancel: () => void;
}

export default function PermissionsModal({ onAllowPermissions, onCancel }: PermissionsModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-lg max-w-md w-full mx-auto p-6 border border-white/10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <CameraIcon className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">
            Camera Access Required
          </h2>
          
          <p className="text-gray-300 text-sm">
            Vision Bot needs access to your device's camera to see what you're showing. Your privacy is important and footage is not stored.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onAllowPermissions} 
            className="w-full bg-primary hover:bg-primary/90"
          >
            Allow Camera Access
          </Button>
          
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="w-full border-white/10 hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}