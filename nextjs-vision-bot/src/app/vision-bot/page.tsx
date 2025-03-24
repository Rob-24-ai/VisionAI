'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { useCustomCamera } from '@/hooks/useCustomCamera';
import { ConnectionStatus } from '@/types/pipecat';
import StatusBar from '@/components/vision-bot/StatusBar';
import VideoFeed from '@/components/vision-bot/VideoFeed';
import CaptionDisplay from '@/components/vision-bot/CaptionDisplay';
import ControlsBar from '@/components/vision-bot/ControlsBar';
import PermissionsModal from '@/components/vision-bot/PermissionsModal';
import ConnectionModal from '@/components/vision-bot/ConnectionModal';
import WelcomeScreen from '@/components/vision-bot/WelcomeScreen';

export default function VisionBot() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [caption, setCaption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  const { formattedTime } = useSessionTimer();
  const { setupCamera, takeSnapshot, hasCamera, hasPermissions } = useCustomCamera();

  // Initialize camera when component mounts
  useEffect(() => {
    // This would be replaced with actual Pipecat client connection
    const checkPermissions = async () => {
      if (!hasCamera) {
        alert('No camera detected on this device');
        router.push('/');
        return;
      }
      
      if (!hasPermissions) {
        setShowPermissionsModal(true);
      }
    };
    
    if (!showWelcome) {
      checkPermissions();
    }
  }, [hasCamera, hasPermissions, router, showWelcome]);

  const handleStartSession = () => {
    setShowWelcome(false);
  };

  const handleAllowPermissions = async () => {
    setShowPermissionsModal(false);
    
    if (videoRef.current) {
      try {
        await setupCamera(videoRef.current, { facingMode: 'environment' });
        setShowConnectionModal(true);
      } catch (error) {
        console.error('Failed to setup camera:', error);
        alert('Failed to access camera. Please check your device permissions.');
        router.push('/');
      }
    }
  };

  const handlePermissionsCancel = () => {
    setShowPermissionsModal(false);
    router.push('/');
  };

  const handleConnectionCancel = () => {
    setShowConnectionModal(false);
    router.push('/');
  };

  const handleMicToggle = () => {
    setIsMicActive(!isMicActive);
    
    // This would be replaced with actual Pipecat mic control
    if (!isMicActive) {
      setConnectionStatus('connected');
      setIsProcessing(true);
      setTimeout(() => {
        setCaption('Hello! I can see you. How can I help you today?');
        setIsProcessing(false);
      }, 2000);
    } else {
      setCaption('');
    }
  };

  const handleEndSession = () => {
    // This would be replaced with actual Pipecat session ending
    setConnectionStatus('disconnected');
    setIsMicActive(false);
    setCaption('');
    router.push('/');
  };

  if (showWelcome) {
    return <WelcomeScreen onStartSession={handleStartSession} />;
  }

  return (
    <>
      {showPermissionsModal && (
        <PermissionsModal 
          onAllowPermissions={handleAllowPermissions}
          onCancel={handlePermissionsCancel}
        />
      )}
      
      {showConnectionModal && (
        <ConnectionModal onCancel={handleConnectionCancel} />
      )}
      
      <div className="relative h-screen w-full overflow-hidden bg-black flex flex-col">
        <StatusBar 
          connectionStatus={connectionStatus}
          sessionTime={formattedTime}
          onEndSession={handleEndSession}
        />
        
        <VideoFeed isProcessing={isProcessing} modelName="Claude Vision">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="h-full w-full object-cover"
          />
          <CaptionDisplay text={caption} />
        </VideoFeed>
        
        <ControlsBar 
          isMicActive={isMicActive}
          onMicToggle={handleMicToggle}
        />
      </div>
    </>
  );
}