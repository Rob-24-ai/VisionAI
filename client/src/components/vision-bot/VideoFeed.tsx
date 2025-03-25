import { useRef, useEffect, useState } from 'react';
import { useCustomCamera } from '../../hooks/useCustomCamera';

interface VideoFeedProps {
  children?: React.ReactNode;
  isProcessing?: boolean;
  modelName?: string;
}

export default function VideoFeed({ children, isProcessing = false, modelName = "" }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const { startCamera, stopCamera, createFallbackVideoStream } = useCustomCamera();
  
  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    // Set up video feed when component mounts
    async function initCamera() {
      if (videoRef.current) {
        try {
          const stream = await startCamera(videoRef.current, { facingMode: 'environment' });
          
          if (mounted) {
            if (stream) {
              setCameraReady(true);
              setIsFallbackActive(false);
            } else {
              throw new Error("Failed to get camera stream");
            }
          }
        } catch (error) {
          console.error('Camera error:', error);
          
          // If we haven't exceeded max retries, try again after a short delay
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying camera initialization (${retryCount}/${maxRetries})...`);
            setTimeout(initCamera, 1000);
            return;
          }
          
          // If all retries failed, use fallback
          if (mounted && videoRef.current) {
            console.log("Using fallback video stream...");
            setIsFallbackActive(true);
            
            // Use our custom fallback stream generator
            createFallbackVideoStream(videoRef.current);
            setCameraReady(true); // Still mark as ready so UI proceeds
            
            // Apply gradient background to the container
            const container = document.querySelector('.camera-container');
            if (container instanceof HTMLElement) {
              container.style.background = 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)';
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
  }, [startCamera, stopCamera, createFallbackVideoStream]);
  
  return (
    <div className="w-full h-full bg-black">
      {/* Camera feed */}
      <div className="camera-container relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${cameraReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
        
        {/* Fallback message */}
        {isFallbackActive && cameraReady && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
            Camera simulation active
          </div>
        )}
        
        {/* Processing indicator (smaller and less obtrusive) */}
        {isProcessing && (
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Processing</span>
          </div>
        )}
        
        {/* Model indicator (if provided) */}
        {modelName && (
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-xs px-2 py-1 rounded text-white">
            {modelName}
          </div>
        )}
        
        {/* Loading state */}
        {!cameraReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
            <div className="w-8 h-8 border-2 border-gray-500 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-400">Initializing camera...</p>
          </div>
        )}
        
        {/* Pass through any children (like captions) */}
        {children}
      </div>
    </div>
  );
}