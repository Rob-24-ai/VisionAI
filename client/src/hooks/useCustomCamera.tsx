import { useCallback, useState } from "react";

interface CameraOptions {
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
}

export function useCustomCamera() {
  const [cameraError, setCameraError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const initCamera = useCallback(async (
    videoElement: HTMLVideoElement,
    options: CameraOptions = { facingMode: "environment" }
  ) => {
    setIsLoading(true);
    setCameraError(null);
    
    try {
      // Check if MediaDevices API is available (might not be in some environments)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this environment");
      }
      
      // Default constraints for mobile-optimized camera
      const constraints = {
        audio: false,
        video: {
          facingMode: options.facingMode || "environment",
          width: { ideal: options.width || 1280 },
          height: { ideal: options.height || 720 },
        }
      };
      
      // Attempt to access camera
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Try to optimize the video track if possible
      stream.getVideoTracks().forEach(track => {
        if (track.getCapabilities && typeof track.getCapabilities === 'function') {
          // Apply any optimizations if needed
          // Note: Latency optimization removed due to compatibility issues
          track.applyConstraints({ 
            advanced: [{ width: { ideal: 1280 }, height: { ideal: 720 } }] 
          }).catch(e => console.log("Could not apply advanced constraints:", e));
        }
      });
      
      // Apply the stream to the video element
      videoElement.srcObject = stream;
      
      // Ensure the video loads properly
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          resolve(true);
        };
      });
      
      setIsLoading(false);
      return stream;
    } catch (error) {
      console.error("Error initializing camera:", error);
      setCameraError(error instanceof Error ? error : new Error(String(error)));
      setIsLoading(false);
      
      // Create a simple canvas-based "demo mode" fallback for environments without camera
      createFallbackVideoStream(videoElement);
      
      throw error;
    }
  }, []);
  
  // Create a fallback "fake" video stream using canvas for demo purposes
  const createFallbackVideoStream = useCallback((videoElement: HTMLVideoElement) => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Draw a simple scene on the canvas
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Camera access unavailable', canvas.width/2, canvas.height/2 - 30);
      ctx.fillText('Demo Mode Active', canvas.width/2, canvas.height/2 + 10);
      
      // Convert the canvas to a video source if possible
      if (canvas.captureStream) {
        const stream = canvas.captureStream();
        videoElement.srcObject = stream;
      }
    } catch (e) {
      console.error("Failed to create fallback video", e);
    }
  }, []);
  
  const takeSnapshot = useCallback((videoElement: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    
    // Draw the current video frame to the canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Get the image data as a base64 encoded string
    return canvas.toDataURL("image/jpeg", 0.9);
  }, []);
  
  return { initCamera, takeSnapshot };
}
