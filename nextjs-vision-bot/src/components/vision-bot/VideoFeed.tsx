'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VideoFeedProps {
  children: React.ReactNode;
  isProcessing?: boolean;
  modelName?: string;
}

export default function VideoFeed({ children, isProcessing = false, modelName = "" }: VideoFeedProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (videoContainerRef.current) {
        // Adjust video container height for mobile
        const vh = window.innerHeight * 0.01;
        videoContainerRef.current.style.height = `${vh * 100}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={videoContainerRef}
      className="relative flex-1 overflow-hidden bg-black"
    >
      {/* Video element and other overlays */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>
      
      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg flex flex-col items-center">
            <div className="flex space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
              <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
              <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
            </div>
            <span className="text-sm font-medium">{modelName} is thinking...</span>
          </div>
        </div>
      )}
      
      {/* Border overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/10 z-10"></div>
    </div>
  );
}