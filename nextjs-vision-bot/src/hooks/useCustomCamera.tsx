'use client';

import { useState, useCallback, useRef } from 'react';

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
  
  // Start camera stream
  const startCamera = useCallback(
    async (videoElement: HTMLVideoElement, options: CameraOptions = { facingMode: 'environment' }) => {
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: options.facingMode,
            width: options.width ? { ideal: options.width } : undefined,
            height: options.height ? { ideal: options.height } : undefined,
          },
          audio: false,
        };

        // Check if the device has camera capabilities
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoInput);

        if (!hasVideoInput) {
          throw new Error('No camera detected on this device');
        }

        // Request camera access
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        setHasPermissions(true);
        
        // Connect stream to video element
        videoElement.srcObject = mediaStream;
        return mediaStream;
      } catch (err) {
        // Handle common errors
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError(new Error('Camera access denied. Please allow camera permissions.'));
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setError(new Error('No camera found on this device.'));
          } else {
            setError(err);
          }
        } else {
          setError(new Error('Failed to access camera'));
        }
        
        // Try fallback for development/testing
        const fallbackStream = createFallbackVideoStream(videoElement);
        if (fallbackStream) {
          setStream(fallbackStream);
          return fallbackStream;
        }
        
        throw error;
      }
    },
    []
  );

  // Create a fallback colored stream (useful for development/testing)
  const createFallbackVideoStream = useCallback((videoElement: HTMLVideoElement) => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.width || 640;
      canvas.height = videoElement.height || 480;
      
      // Get the canvas context and draw a colored background
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw dark background with text
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Camera not available', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('Using fallback display', canvas.width / 2, canvas.height / 2 + 20);
        
        // Create a stream from the canvas
        // @ts-ignore - captureStream not in TypeScript defs but supported in browsers
        const stream = canvas.captureStream(30);
        videoElement.srcObject = stream;
        return stream;
      }
    } catch (err) {
      console.error('Failed to create fallback stream:', err);
    }
    
    return null;
  }, []);

  // Take a snapshot from the video feed
  const takeSnapshot = useCallback((videoElement: HTMLVideoElement) => {
    if (!videoElement) return null;
    
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
      console.error('Failed to take snapshot:', err);
    }
    
    return null;
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  return {
    stream,
    hasCamera,
    hasPermissions,
    error,
    startCamera,
    stopCamera,
    takeSnapshot,
    createFallbackVideoStream
  };
}