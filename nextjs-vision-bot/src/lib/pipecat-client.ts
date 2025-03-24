'use client';

import { useEffect, useState, useCallback } from 'react';
import { ConnectionStatus, ExtendedRTVIClient, PipecatClientConfig } from '@/types/pipecat';

// Import this once the Pipecat SDK is installed
// import { RTVIClientAudio } from '@pipecat-ai/client-js';
// For now we'll use a placeholder
let RTVIClientAudio: any = null;

// Configuration for Pipecat Cloud
// This will be populated with actual API key when provided
const pipecatConfig: PipecatClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_PIPECAT_API_KEY, // This will be set from environment variable
  baseUrl: 'https://api.pipecat.ai',
  endpoint: {
    connect: '/v1/connect',
  },
};

export function usePipecatClient() {
  const [client, setClient] = useState<ExtendedRTVIClient | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize client
  useEffect(() => {
    // In the actual implementation, we would use:
    // const pipecatClient = new RTVIClientAudio(pipecatConfig);
    
    // For MVP, we'll use a simulated client
    const simulatedClient: ExtendedRTVIClient = {
      hasDevicePermissions: () => false,
      requestDevicePermissions: async () => {
        // In real implementation, this would request actual permissions
        console.log('Requesting device permissions');
        return new Promise<void>(resolve => {
          // Simulate permission request
          setTimeout(resolve, 1000);
        });
      },
      connect: () => {
        console.log('Connecting to Pipecat Cloud');
        setStatus('connecting');
        // Simulate connection process
        setTimeout(() => {
          if (Math.random() > 0.2) { // 80% success rate for demo
            setStatus('connected');
            console.log('Connected to Pipecat Cloud');
          } else {
            setStatus('error');
            setError(new Error('Failed to connect to Pipecat Cloud'));
          }
        }, 2000);
      },
      disconnect: () => {
        console.log('Disconnecting from Pipecat Cloud');
        setStatus('disconnected');
        setTranscript('');
      },
      muteMicrophone: () => {
        console.log('Muting microphone');
      },
      unmuteMicrophone: () => {
        console.log('Unmuting microphone');
      },
      on: (event, callback) => {
        if (event === 'transcript') {
          // Simulate transcript events when connected
          const interval = setInterval(() => {
            if (status === 'connected' && !isProcessing) {
              const mockTranscripts = [
                "I can see a painting with vibrant colors.",
                "The composition draws the eye to the center.",
                "The brushwork shows excellent technique.",
                "I notice interesting use of light and shadow.",
                "The artwork has a strong emotional quality.",
                "The perspective creates depth in the scene."
              ];
              
              const randomText = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
              callback({ 
                transcript: { text: randomText, final: true },
                role: 'assistant'
              });
              
              setTranscript(randomText);
            }
          }, 8000);
          
          return () => clearInterval(interval);
        }
        
        if (event === 'processingStateChange') {
          // Simulate processing state changes
          const interval = setInterval(() => {
            if (status === 'connected') {
              const newProcessingState = !isProcessing;
              setIsProcessing(newProcessingState);
              callback({ processing: newProcessingState });
            }
          }, 4000);
          
          return () => clearInterval(interval);
        }
      },
      off: (event, callback) => {
        // Cleanup event handlers
        console.log(`Removed handler for ${event}`);
      }
    };
    
    setClient(simulatedClient);
    
    return () => {
      // Cleanup
      if (status === 'connected') {
        simulatedClient.disconnect();
      }
    };
  }, [status, isProcessing]);
  
  // Connect to Pipecat
  const connect = useCallback(() => {
    if (client && status !== 'connected' && status !== 'connecting') {
      client.connect();
    }
  }, [client, status]);
  
  // Disconnect from Pipecat
  const disconnect = useCallback(() => {
    if (client && (status === 'connected' || status === 'connecting')) {
      client.disconnect();
    }
  }, [client, status]);
  
  // Toggle microphone
  const toggleMicrophone = useCallback((isMuted: boolean) => {
    if (!client) return;
    
    if (isMuted) {
      client.muteMicrophone?.();
    } else {
      client.unmuteMicrophone?.();
    }
  }, [client]);
  
  return {
    client,
    status,
    isProcessing,
    transcript,
    error,
    connect,
    disconnect,
    toggleMicrophone
  };
}

// To be imported from Pipecat SDK
export const PipecatAudio = RTVIClientAudio;