import { useState, useEffect } from 'react';

// Components
import VideoFeed from '../components/vision-bot/VideoFeed';
import CaptionDisplay from '../components/vision-bot/CaptionDisplay';
import ControlsBar from '../components/vision-bot/ControlsBar';
import StatusBar from '../components/vision-bot/StatusBar';
import WelcomeScreen from '../components/vision-bot/WelcomeScreen';
import PermissionsModal from '../components/vision-bot/PermissionsModal';
import ConnectionModal from '../components/vision-bot/ConnectionModal';
import PersonaSelector from '../components/vision-bot/PersonaSelector';

// Hooks and Context
import { usePipecatClient } from '../lib/pipecat-client';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { useAudioLevels } from '../hooks/useAudioLevels';
import { PersonaProvider } from '../contexts/PersonaContext';

// Types
import { ConnectionStatus } from '../types/pipecat';

type AppState = 'welcome' | 'active' | 'ended';

function VisionBotContent() {
  // App state
  const [appState, setAppState] = useState<AppState>('welcome');
  const [showPermissionsModal, setShowPermissionsModal] = useState<boolean>(false);
  const [showConnectionModal, setShowConnectionModal] = useState<boolean>(false);
  
  // Pipecat client integration
  const { 
    client, 
    status, 
    isProcessing, 
    transcript, 
    isMicActive,
    connect, 
    disconnect, 
    toggleMicrophone 
  } = usePipecatClient();
  
  // Audio levels for microphone visualization
  const { audioLevel } = useAudioLevels({
    enabled: isMicActive && appState === 'active',
    smoothingFactor: 0.5
  });
  
  // Session timer
  const { startTimer, pauseTimer, resetTimer, formattedTime, isRunning } = useSessionTimer();
  
  // Start a new session
  const handleStartSession = () => {
    setShowPermissionsModal(true);
  };
  
  // Handle permissions response
  const handleAllowPermissions = async () => {
    setShowPermissionsModal(false);
    
    // Request device permissions if client supports it
    if (client?.hasDevicePermissions && !client.hasDevicePermissions()) {
      try {
        await client.requestDevicePermissions?.();
      } catch (error) {
        console.error('Failed to get permissions:', error);
        return;
      }
    }
    
    // Show connection modal and attempt to connect
    setShowConnectionModal(true);
    connect();
  };
  
  // Handle connection state changes
  useEffect(() => {
    if (status === 'connected') {
      // Connection successful
      setShowConnectionModal(false);
      setAppState('active');
      startTimer();
      
    } else if (status === 'error') {
      // Connection failed
      setShowConnectionModal(false);
      // Could show an error modal here
    }
  }, [status, startTimer]);
  
  // Handle microphone toggle
  const handleMicToggle = () => {
    if (toggleMicrophone) {
      toggleMicrophone();
    }
  };
  
  // End session and return to welcome screen
  const handleEndSession = () => {
    disconnect();
    resetTimer();
    setAppState('welcome');
  };
  
  // Render based on app state
  return (
    <div className="h-screen w-full bg-black overflow-hidden relative">
      {appState === 'welcome' ? (
        <WelcomeScreen onStartSession={handleStartSession} />
      ) : (
        <>
          {/* Main video feed with captions */}
          <VideoFeed isProcessing={isProcessing} modelName="">
            <CaptionDisplay text={transcript} />
          </VideoFeed>
          
          {/* Status bar */}
          <StatusBar 
            connectionStatus={status as ConnectionStatus} 
            sessionTime={formattedTime} 
            onEndSession={handleEndSession} 
          />
          
          {/* Controls */}
          <ControlsBar 
            isMicActive={isMicActive} 
            onMicToggle={handleMicToggle}
            audioLevel={audioLevel}
          />
          
          {/* Persona selector */}
          <PersonaSelector compact={true} />
        </>
      )}
      
      {/* Modals */}
      {showPermissionsModal && (
        <PermissionsModal 
          onAllowPermissions={handleAllowPermissions} 
          onCancel={() => setShowPermissionsModal(false)} 
        />
      )}
      
      {showConnectionModal && (
        <ConnectionModal 
          onCancel={() => {
            setShowConnectionModal(false);
            disconnect();
          }} 
        />
      )}
    </div>
  );
}

export default function VisionBot() {
  return (
    <PersonaProvider>
      <VisionBotContent />
    </PersonaProvider>
  );
}