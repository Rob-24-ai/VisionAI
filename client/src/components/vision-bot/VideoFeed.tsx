import { useRef, useEffect } from "react";
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
  
  useEffect(() => {
    if (videoRef.current) {
      initCamera(videoRef.current, { facingMode: "environment" });
    }
    
    // Clean up camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initCamera]);

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="relative w-full h-full max-h-[85vh] overflow-hidden rounded-2xl bg-dark-700">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform"
        />
        
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
