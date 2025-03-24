interface ConnectionModalProps {
  onCancel: () => void;
}

export default function ConnectionModal({ onCancel }: ConnectionModalProps) {
  return (
    <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-xl p-6 max-w-xs w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Connecting to Vision Bot</h3>
          <p className="text-gray-400 text-sm mb-4">Establishing secure connection...</p>
          
          <div className="flex justify-center space-x-2 mb-4">
            <div className="loading-dot w-2 h-2 rounded-full bg-primary"></div>
            <div className="loading-dot w-2 h-2 rounded-full bg-primary"></div>
            <div className="loading-dot w-2 h-2 rounded-full bg-primary"></div>
          </div>
        </div>
        
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
