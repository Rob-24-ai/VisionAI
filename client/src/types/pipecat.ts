// Define simpler types for our custom implementation
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface TranscriptEvent {
  transcript: {
    text: string;
    final: boolean;
  };
  role: "user" | "assistant";
}

export interface ProcessingStateEvent {
  processing: boolean;
}

export interface ConnectionEvent {
  connected: boolean;
}

export interface ErrorEvent {
  error: Error;
  message: string;
}

export interface PipecatClientConfig {
  apiKey?: string;
  baseUrl: string;
  endpoint: {
    connect: string;
  };
}

export type PipecatEventTypes = 
  | "connected"
  | "disconnected" 
  | "error" 
  | "transcript" 
  | "processingStateChange"
  | string; // Allow string for other event types

// Define a simplified client interface for our app
export interface ExtendedRTVIClient {
  hasDevicePermissions?: () => boolean;
  requestDevicePermissions?: () => Promise<void>;
  connect: () => Promise<any>;
  disconnect: () => void;
  muteMicrophone?: () => void;
  unmuteMicrophone?: () => void;
  on(event: PipecatEventTypes, callback: (data: any) => void): void;
  off(event: PipecatEventTypes, callback: (data: any) => void): void;
  
  // Extended properties for our app
  status: ConnectionStatus;
  isProcessing: boolean;
  transcript: string;
  toggleMicrophone: () => void;
  
  // Internal method for simulations - not part of the real Pipecat API
  _setTranscript?: (text: string) => void;
}