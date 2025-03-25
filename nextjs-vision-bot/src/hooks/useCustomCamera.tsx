'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface CameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export function useCustomCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true); // Assume true initially to avoid flickering
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const cameraAttempted = useRef<boolean>(false);

  // Check for camera devices
  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoInput);
      } catch (err) {
        console.error('Failed to enumerate devices:', err);
        setHasCamera(false);
      }
    };
    
    checkCameraAvailability();
  }, []);
  
  // Setup camera stream
  const setupCamera = useCallback(
    async (videoElement: HTMLVideoElement, options: CameraOptions = { facingMode: 'environment' }) => {
      if (cameraAttempted.current && stream) {
        console.log('Camera already set up, using existing stream');
        videoElement.srcObject = stream;
        return stream;
      }
      
      cameraAttempted.current = true;
      
      try {
        // Clear any previous errors
        setError(null);
        
        // Define constraints with rear camera preferred
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: options.facingMode,
            width: options.width ? { ideal: options.width } : { ideal: 1280 },
            height: options.height ? { ideal: options.height } : { ideal: 720 },
          },
          audio: false,
        };

        console.log('Requesting camera with constraints:', constraints);

        // Request camera access
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Add event listener for when a track ends (could happen if permissions are revoked)
        mediaStream.getTracks().forEach(track => {
          track.addEventListener('ended', () => {
            console.log('Track ended:', track.label);
            setStream(null);
            setHasPermissions(false);
          });
        });
        
        setStream(mediaStream);
        setHasPermissions(true);
        
        // Ensure video element gets the stream
        if (videoElement) {
          videoElement.srcObject = mediaStream;
          
          // Make sure video plays
          const playPromise = videoElement.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Error playing video:', error);
              // Most browsers will only allow autoplay if video is muted
              videoElement.muted = true;
              videoElement.play().catch(e => console.error('Still cannot play video:', e));
            });
          }
        }
        
        return mediaStream;
      } catch (err) {
        console.error('Camera access error:', err);
        
        // Handle common errors with clear user messages
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError(new Error('Camera access denied. Please allow camera permissions.'));
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setError(new Error('No camera found on this device.'));
            setHasCamera(false);
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            setError(new Error('Camera is already in use by another application.'));
          } else if (err.name === 'OverconstrainedError') {
            // Try again with less strict constraints
            try {
              const simpleConstraints = { video: true, audio: false };
              const simpleStream = await navigator.mediaDevices.getUserMedia(simpleConstraints);
              setStream(simpleStream);
              setHasPermissions(true);
              videoElement.srcObject = simpleStream;
              return simpleStream;
            } catch (fallbackErr) {
              setError(new Error('Camera not compatible with required settings.'));
            }
          } else {
            setError(err);
          }
        } else {
          setError(new Error('Failed to access camera'));
        }
        
        // Create a fallback display
        const fallbackStream = createFallbackVideoStream(videoElement);
        if (fallbackStream) {
          setStream(fallbackStream);
          return fallbackStream;
        }
        
        throw error || new Error('Camera initialization failed');
      }
    },
    [stream]
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
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      setStream(null);
    }
  }, [stream]);

  return {
    stream,
    hasCamera,
    hasPermissions,
    error,
    setupCamera,
    stopCamera,
    takeSnapshot,
    createFallbackVideoStream
  };
}