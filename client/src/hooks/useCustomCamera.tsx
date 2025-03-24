import { useCallback } from "react";

interface CameraOptions {
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
}

export function useCustomCamera() {
  const initCamera = useCallback(async (
    videoElement: HTMLVideoElement,
    options: CameraOptions = { facingMode: "environment" }
  ) => {
    try {
      // Default constraints for mobile-optimized camera
      const constraints = {
        audio: false,
        video: {
          facingMode: options.facingMode || "environment",
          width: { ideal: options.width || 1280 },
          height: { ideal: options.height || 720 },
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Set video track to low-latency mode if available
      stream.getVideoTracks().forEach(track => {
        const capabilities = track.getCapabilities();
        if (capabilities.latency) {
          track.applyConstraints({ 
            advanced: [{ latency: capabilities.latency.min }] 
          });
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
      
      return stream;
    } catch (error) {
      console.error("Error initializing camera:", error);
      throw error;
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
