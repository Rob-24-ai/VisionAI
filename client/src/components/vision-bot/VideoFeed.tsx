import { useRef, useEffect, useState } from "react";
import { useRTVIClient } from "@pipecat-ai/client-react";
import { useCustomCamera } from "@/hooks/useCustomCamera";

interface VideoFeedProps {
  children: React.ReactNode;
  isProcessing?: boolean;
  modelName?: string;
}

export default function VideoFeed({ children, isProcessing = false, modelName = "" }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const client = useRTVIClient();
  const { initCamera } = useCustomCamera();
  const [cameraInitFailed, setCameraInitFailed] = useState(false);
  
  useEffect(() => {
    let cameraStream: MediaStream | null = null;
    
    async function setupCamera() {
      if (videoRef.current) {
        try {
          cameraStream = await initCamera(videoRef.current, { facingMode: "environment" });
          setCameraInitFailed(false);
        } catch (error) {
          console.log("Camera init failed, using fallback mode");
          setCameraInitFailed(true);
        }
      }
    }
    
    setupCamera();
    
    // Clean up camera when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initCamera]);

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-dark-700">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform"
        />
        
        {/* Camera Status Message (for fallback) */}
        {cameraInitFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900/50 backdrop-blur-sm">
            <div className="text-center px-4">
              <p className="text-white text-lg font-semibold mb-2">Camera Unavailable</p>
              <p className="text-gray-300 text-sm">Using fallback mode</p>
            </div>
          </div>
        )}
        
        {/* Video Overlay (Model/Processing indicator) */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {modelName && (
            <div className="bg-dark-900/70 backdrop-blur-sm text-xs px-3 py-1 rounded-full">
              {modelName}
            </div>
          )}
          
          {isProcessing && (
            <div className="bg-dark-900/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
              <div className="flex space-x-1">
                <div className="loading-dot w-1.5 h-1.5 rounded-full bg-white"></div>
                <div className="loading-dot w-1.5 h-1.5 rounded-full bg-white"></div>
                <div className="loading-dot w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
            </div>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
}
