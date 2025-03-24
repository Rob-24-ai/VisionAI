interface PermissionsModalProps {
  onAllowPermissions: () => void;
  onCancel: () => void;
}

export default function PermissionsModal({ onAllowPermissions, onCancel }: PermissionsModalProps) {
  return (
    <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-xl p-6 max-w-xs w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Camera & Microphone Access</h3>
          <p className="text-gray-400 text-sm mb-4">Vision Bot needs access to your camera and microphone to work.</p>
          
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs">Camera</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <span className="text-xs">Microphone</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onAllowPermissions}
          className="w-full bg-primary py-3 rounded-lg text-white font-medium mb-2"
        >
          Allow Access
        </button>
        
        <button 
          onClick={onCancel}
          className="w-full py-2 text-sm text-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
