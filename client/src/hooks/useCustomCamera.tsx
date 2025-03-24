import { useState, useCallback } from 'react';

interface CameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export function useCustomCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Start camera stream
  const startCamera = useCallback(
    async (videoElement: HTMLVideoElement, options: CameraOptions = { facingMode: 'environment' }) => {
      try {
        // Clear any previous errors
        setError(null);
        
        // Check if environment-facing camera is available (for mobile devices)
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: options.facingMode,
            width: options.width ? { ideal: options.width } : undefined,
            height: options.height ? { ideal: options.height } : undefined,
          },
          audio: false,
        };
        
        // Get user media stream
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Set stream to video element
        videoElement.srcObject = mediaStream;
        setStream(mediaStream);
        setHasPermissions(true);
        
        // Return the stream for any further processing
        return mediaStream;
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to start camera';
        console.error('Camera error:', errorMsg);
        setError(err);
        
        // Check if it's a permission error
        if (errorMsg.includes('Permission denied') || 
            errorMsg.includes('not allowed')) {
          setHasPermissions(false);
        }
        
        // Check if camera is not available
        if (errorMsg.includes('device not found') || 
            errorMsg.includes('Requested device not found')) {
          setHasCamera(false);
        }
        
        // Try fallback to front camera if environment camera not available
        if (options.facingMode === 'environment' && 
            (errorMsg.includes('device not found') || 
             errorMsg.includes('Requested device not found'))) {
          try {
            return startCamera(videoElement, { ...options, facingMode: 'user' });
          } catch (err) {
            // If both cameras fail, continue with error
            console.error('Fallback camera also failed:', err);
          }
        }
        
        return null;
      }
    },
    []
  );
  
  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);
  
  // Create a fallback video stream using placeholder or canvas
  const createFallbackVideoStream = useCallback((videoElement: HTMLVideoElement) => {
    // Create a canvas element as fallback
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.width || 640;
    canvas.height = videoElement.height || 480;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw a simple placeholder
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text
      ctx.fillStyle = '#aaa';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Camera unavailable', canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillText('Please check permissions', canvas.width / 2, canvas.height / 2 + 20);
    }
    
    // Use canvas as video source
    const canvasStream = canvas.captureStream(30); // 30fps
    videoElement.srcObject = canvasStream;
    return canvasStream;
  }, []);
  
  // Take a snapshot from the video element
  const takeSnapshot = useCallback((videoElement: HTMLVideoElement) => {
    if (!videoElement || videoElement.readyState < 2) {
      console.warn('Video not ready for snapshot');
      return null;
    }
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
      }
    } catch (err) {
      console.error('Error taking snapshot:', err);
    }
    
    return null;
  }, []);
  
  return {
    stream,
    hasCamera,
    hasPermissions,
    error,
    startCamera,
    stopCamera,
    takeSnapshot,
    createFallbackVideoStream,
  };
}