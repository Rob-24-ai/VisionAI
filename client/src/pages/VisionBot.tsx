import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { RTVIClientProvider } from "@pipecat-ai/client-react";
import { useRTVIClient } from "@pipecat-ai/client-react";
import { usePipecatClient } from "@/lib/pipecat-client";
import VideoFeed from "@/components/vision-bot/VideoFeed";
import CaptionDisplay from "@/components/vision-bot/CaptionDisplay";
import ControlsBar from "@/components/vision-bot/ControlsBar";
import ConnectionModal from "@/components/vision-bot/ConnectionModal";
import PermissionsModal from "@/components/vision-bot/PermissionsModal";
import StatusBar from "@/components/vision-bot/StatusBar";
import WelcomeScreen from "@/components/vision-bot/WelcomeScreen";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { ConnectionStatus } from "@/types/pipecat";

function VisionBotContent() {
  const client = useRTVIClient();
  const [, setLocation] = useLocation();
  const { time, isRunning, startTimer, stopTimer, resetTimer } = useSessionTimer();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  
  // Check if client is ready
  useEffect(() => {
    if (client) {
      setClientReady(true);
    }
  }, [client]);
  
  // Handle connection states
  useEffect(() => {
    if (!client) return; // Skip if client is not initialized
    
    const onConnect = () => {
      setConnectionStatus("connected");
      setShowConnectionModal(false);
      startTimer();
    };
    
    const onDisconnect = () => {
      setConnectionStatus("disconnected");
      stopTimer();
    };
    
    const onError = () => {
      setConnectionStatus("error");
      setShowConnectionModal(false);
    };
    
    const onTranscript = (event: any) => {
      if (event.transcript?.final && event.role === "assistant") {
        setCaptionText(event.transcript.text);
      }
    };
    
    const onProcessingStateChange = (event: any) => {
      setIsProcessing(event.processing);
    };
    
    client.on("connect", onConnect);
    client.on("disconnect", onDisconnect);
    client.on("error", onError);
    client.on("transcript", onTranscript);
    client.on("processingStateChange", onProcessingStateChange);
    
    return () => {
      client.off("connect", onConnect);
      client.off("disconnect", onDisconnect);
      client.off("error", onError);
      client.off("transcript", onTranscript);
      client.off("processingStateChange", onProcessingStateChange);
    };
  }, [client, startTimer, stopTimer]);
  
  const handleStartSession = useCallback(() => {
    setShowWelcome(false);
    // Check if we need to request permissions first
    if (!client.hasDevicePermissions()) {
      setShowPermissionsModal(true);
    } else {
      setShowConnectionModal(true);
      client.connect();
    }
  }, [client]);
  
  const handleAllowPermissions = useCallback(async () => {
    try {
      await client.requestDevicePermissions();
      setShowPermissionsModal(false);
      setShowConnectionModal(true);
      client.connect();
    } catch (error) {
      console.error("Failed to get permissions:", error);
    }
  }, [client]);
  
  const handleCancelPermissions = useCallback(() => {
    setShowPermissionsModal(false);
    setShowWelcome(true);
  }, []);
  
  const handleCancelConnection = useCallback(() => {
    client.disconnect();
    setShowConnectionModal(false);
    setShowWelcome(true);
  }, [client]);
  
  const handleEndSession = useCallback(() => {
    client.disconnect();
    resetTimer();
    setShowWelcome(true);
  }, [client, resetTimer]);
  
  const handleMicToggle = useCallback(() => {
    if (isMicActive) {
      client.muteMicrophone();
    } else {
      client.unmuteMicrophone();
    }
    setIsMicActive(!isMicActive);
  }, [isMicActive, client]);
  
  const handleGoHome = useCallback(() => {
    client.disconnect();
    setLocation("/");
  }, [client, setLocation]);
  
  return (
    <div className="flex flex-col h-screen bg-dark-900 text-white">
      <StatusBar 
        connectionStatus={connectionStatus} 
        sessionTime={time} 
        onEndSession={handleEndSession} 
      />
      
      <div className="flex-1 flex flex-col p-4 relative">
        <VideoFeed 
          isProcessing={isProcessing}
          modelName="CLAUDE 3.5 SONNET"
        >
          <CaptionDisplay text={captionText} />
        </VideoFeed>
      </div>
      
      <ControlsBar 
        isMicActive={isMicActive} 
        onMicToggle={handleMicToggle} 
      />
      
      {showWelcome && (
        <WelcomeScreen onStartSession={handleStartSession} />
      )}
      
      {showPermissionsModal && (
        <PermissionsModal 
          onAllowPermissions={handleAllowPermissions}
          onCancel={handleCancelPermissions}
        />
      )}
      
      {showConnectionModal && (
        <ConnectionModal onCancel={handleCancelConnection} />
      )}
    </div>
  );
}

export default function VisionBot() {
  const pipecatClient = usePipecatClient();
  
  return (
    <RTVIClientProvider client={pipecatClient}>
      <VisionBotContent />
    </RTVIClientProvider>
  );
}
