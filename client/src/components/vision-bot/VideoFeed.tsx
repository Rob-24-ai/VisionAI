import { useRef, useEffect, useState } from 'react';
import { useCustomCamera } from '../../hooks/useCustomCamera';

interface VideoFeedProps {
  children: React.ReactNode;
  isProcessing?: boolean;
  modelName?: string;
}

export default function VideoFeed({ children, isProcessing = false, modelName = "" }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const { startCamera, stopCamera } = useCustomCamera();
  
  useEffect(() => {
    let mounted = true;
    
    // Set up video feed when component mounts
    async function initCamera() {
      if (videoRef.current) {
        try {
          await startCamera(videoRef.current, { facingMode: 'environment' });
          if (mounted) setCameraReady(true);
        } catch (error) {
          console.error('Failed to setup camera:', error);
          
          // Create a fallback for Replit environment where camera might not be accessible
          if (mounted) {
            // Use fallback gradient background instead
            if (videoRef.current) {
              videoRef.current.style.display = 'none';
              setCameraReady(true); // Still mark as ready so UI proceeds
              
              // Add a gradient background to parent element to simulate an image
              const parent = videoRef.current.parentElement;
              if (parent) {
                parent.style.background = 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)';
                
                // Create a text overlay to inform user
                const infoElement = document.createElement('div');
                infoElement.textContent = 'Camera simulation active';
                infoElement.style.position = 'absolute';
                infoElement.style.top = '10%';
                infoElement.style.left = '50%';
                infoElement.style.transform = 'translateX(-50%)';
                infoElement.style.color = 'rgba(255,255,255,0.5)';
                infoElement.style.fontSize = '14px';
                infoElement.style.fontFamily = 'sans-serif';
                infoElement.style.padding = '8px 16px';
                infoElement.style.borderRadius = '4px';
                infoElement.style.backgroundColor = 'rgba(0,0,0,0.3)';
                parent.appendChild(infoElement);
              }
            }
          }
        }
      }
    }
    
    initCamera();
    
    // Clean up
    return () => {
      mounted = false;
      stopCamera();
    };
  }, [startCamera, stopCamera]);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-dark-900 overflow-hidden">
      {/* Camera feed */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${cameraReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
        
        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Model indicator (if provided) */}
        {modelName && (
          <div className="absolute top-4 right-4 bg-dark-800/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white">
            {modelName}
          </div>
        )}
        
        {/* Loading state */}
        {!cameraReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900">
            <div className="w-12 h-12 border-2 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-gray-400">Initializing camera...</p>
          </div>
        )}
        
        {/* Border effect when processing */}
        <div 
          className={`absolute inset-0 pointer-events-none border-2 transition-colors duration-300 ${
            isProcessing ? 'border-primary' : 'border-transparent'
          }`}
        ></div>
        
        {/* Pass through any children (like captions) */}
        {children}
      </div>
    </div>
  );
}