import { useState, useCallback, useEffect } from 'react';

interface CameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export function useCustomCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if the device has camera capabilities
    const checkCameraAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
      } catch (err) {
        console.error('Error checking camera availability:', err);
        setHasCamera(false);
      }
    };

    checkCameraAvailability();
  }, []);

  const setupCamera = useCallback(
    async (
      videoElement: HTMLVideoElement,
      options: CameraOptions = { facingMode: 'environment' }
    ): Promise<MediaStream> => {
      if (stream) {
        // Clean up previous stream
        stream.getTracks().forEach(track => track.stop());
      }

      try {
        // Default constraints
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: options.facingMode || 'environment',
            width: options.width ? { ideal: options.width } : undefined,
            height: options.height ? { ideal: options.height } : undefined,
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        setHasPermissions(true);
        
        if (videoElement) {
          videoElement.srcObject = mediaStream;
          await videoElement.play().catch(e => {
            console.error("Error playing video:", e);
          });
        }
        
        return mediaStream;
      } catch (err: any) {
        setError(err);
        console.error('Camera setup error:', err);
        
        // Fall back to user-facing camera if environment-facing fails
        if (options.facingMode === 'environment') {
          try {
            console.log('Trying fallback to user-facing camera');
            return setupCamera(videoElement, { 
              ...options, 
              facingMode: 'user' 
            });
          } catch (fallbackErr) {
            console.error('Fallback camera also failed:', fallbackErr);
            throw fallbackErr;
          }
        }
        
        throw err;
      }
    },
    [stream]
  );

  const createFallbackVideoStream = useCallback((videoElement: HTMLVideoElement) => {
    // Create a canvas-based fallback when no camera is available
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw fallback image/text
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '24px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('Camera not available', canvas.width / 2, canvas.height / 2);
        
        // Create a stream from the canvas
        const stream = canvas.captureStream(30); // 30 FPS
        videoElement.srcObject = stream;
        videoElement.play();
        return stream;
      }
    } catch (err) {
      console.error('Error creating fallback video:', err);
    }
    return null;
  }, []);

  const takeSnapshot = useCallback((videoElement: HTMLVideoElement) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    } catch (err) {
      console.error('Error taking snapshot:', err);
    }
    return null;
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  return {
    stream,
    hasCamera,
    hasPermissions,
    error,
    setupCamera,
    createFallbackVideoStream,
    takeSnapshot,
    stopCamera
  };
}