import { useState, useEffect, useCallback } from 'react';
import { usePersona } from '../contexts/PersonaContext';
import { ExtendedRTVIClient, ConnectionStatus, PipecatClientConfig } from '../types/pipecat';

// Configuration for Pipecat client
const pipecatConfig: PipecatClientConfig = {
  baseUrl: 'https://api.pipecat.ai',
  endpoint: {
    connect: '/rtvi/connect'
  }
};

// Debug environments without real camera/mic or API access
// For now we use simulation mode since we don't have a real API key
const USE_SIMULATION_MODE = true; // import.meta.env.VITE_USE_SIMULATION_MODE === 'true';

export function usePipecatClient() {
  const [client, setClient] = useState<ExtendedRTVIClient | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const { currentPersona } = usePersona();

  // Initialize the client
  useEffect(() => {
    // We'll always use a simulated client for now
    const simulatedClient: ExtendedRTVIClient = {
      // Stub methods for simulating behavior
      connect: () => {
        setStatus('connecting');
        // Simulate connection delay
        return new Promise((resolve) => {
          setTimeout(() => {
            setStatus('connected');
            resolve({});
          }, 2000);
        });
      },
      disconnect: () => {
        setStatus('disconnected');
        setTranscript('');
      },
      muteMicrophone: () => setIsMicActive(false),
      unmuteMicrophone: () => setIsMicActive(true),
      on: (event: string, callback: any) => {
        // No-op for simulation
      },
      off: (event: string, callback: any) => {
        // No-op for simulation
      },
      hasDevicePermissions: () => true,
      requestDevicePermissions: async () => {},
      
      // Extended properties
      status: 'disconnected',
      isProcessing: false,
      transcript: '',
      toggleMicrophone: () => setIsMicActive(prev => !prev)
    };
    
    setClient(simulatedClient);
    
    // In a real implementation, we would initialize with the Pipecat SDK here
    // For now, we're sticking with the simulated client

  }, []);
  
  // Simulate transcript responses when mic is activated
  useEffect(() => {
    if (!client || status !== 'connected' || !isMicActive) return;
    
    // Simulate processing when mic is active
    let processingTimeout: NodeJS.Timeout;
    let responseTimeout: NodeJS.Timeout;
    
    const simulateProcessing = () => {
      // Start processing after a short delay
      processingTimeout = setTimeout(() => {
        setIsProcessing(true);
        
        // After some time, show a response
        responseTimeout = setTimeout(() => {
          setIsProcessing(false);
          
          // Use the current persona to customize the response
          const responses = [
            `I can see your artwork. ${currentPersona.name} here. The composition looks interesting, with good use of ${Math.random() > 0.5 ? 'color' : 'perspective'}.`,
            `From my perspective as ${currentPersona.title}, I notice strong elements of ${Math.random() > 0.5 ? 'balance' : 'contrast'} in this piece.`,
            `This is an intriguing work. I particularly like the ${Math.random() > 0.5 ? 'texture' : 'focal point'} you've created.`,
            `As ${currentPersona.name}, I'd suggest ${Math.random() > 0.5 ? 'exploring more depth in the shadows' : 'considering how light affects the overall mood'}.`
          ];
          
          // Pick a random response
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          setTranscript(randomResponse);
          
          // After a while, reset for another potential interaction
          setTimeout(simulateProcessing, 10000);
        }, 3000);
      }, 1000);
    };
    
    // Start the simulation cycle
    simulateProcessing();
    
    // Cleanup timeouts
    return () => {
      clearTimeout(processingTimeout);
      clearTimeout(responseTimeout);
    };
  }, [client, status, isMicActive, currentPersona]);
  
  // Update system prompt when persona changes
  useEffect(() => {
    // Only attempt if we have a client and are connected
    if (client && status === 'connected') {
      // Would normally set system prompt here with client.setSystemPrompt
      console.log('Setting system prompt for persona:', currentPersona.name);
      // For simulation, we'll show a new message when persona changes
      if (isMicActive) {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setTranscript(`I've switched perspective to ${currentPersona.name}, ${currentPersona.title}. Let me analyze your artwork from this new angle.`);
        }, 1500);
      }
    }
  }, [client, currentPersona, status, isMicActive]);
  
  const connect = useCallback(() => {
    if (client) {
      setStatus('connecting');
      client.connect().catch((error: any) => {
        console.error('Connection error:', error);
        setStatus('error');
      });
    }
  }, [client]);
  
  const disconnect = useCallback(() => {
    if (client) {
      client.disconnect();
      setStatus('disconnected');
      setTranscript('');
    }
  }, [client]);
  
  const toggleMicrophone = useCallback(() => {
    if (client) {
      // Toggle the internal state
      setIsMicActive(!isMicActive);
      
      // Call the client's method
      if (isMicActive) {
        client.muteMicrophone?.();
      } else {
        client.unmuteMicrophone?.();
      }
    }
  }, [client, isMicActive]);
  
  return {
    client,
    status,
    isProcessing,
    transcript,
    isMicActive,
    connect,
    disconnect,
    toggleMicrophone
  };
}