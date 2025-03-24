import React, { useState, useEffect } from "react";
import { RTVIClient } from "@pipecat-ai/client-js";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { RTVIClientAudio } from "@pipecat-ai/client-react";

export function usePipecatClient() {
  const [client, setClient] = useState<RTVIClient | null>(null);
  
  useEffect(() => {
    const PIPECAT_API_URL = import.meta.env.VITE_PIPECAT_API_URL || "/api";
    const PIPECAT_API_KEY = import.meta.env.VITE_PIPECAT_API_KEY || "";
    
    // Create the transport layer using Daily.co
    const transport = new DailyTransport({
      // Additional Daily.co configuration if needed
    });
    
    // Create the Pipecat client
    const rtviClient = new RTVIClient({
      params: {
        baseUrl: PIPECAT_API_URL,
        endpoint: {
          connect: "/connect",
        },
        // Include API key if required by your setup
        apiKey: PIPECAT_API_KEY,
      },
      transport,
      enableMic: false, // Start with mic disabled
      enableCam: true, // Enable camera by default for vision bot
    });
    
    setClient(rtviClient);
    
    // Clean up client on unmount
    return () => {
      if (rtviClient) {
        rtviClient.disconnect();
      }
    };
  }, []);
  
  return client as RTVIClient;
}

// Audio component wrapper
export const PipecatAudio = RTVIClientAudio;
