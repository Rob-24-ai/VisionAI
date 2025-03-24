// Define connection status types for Pipecat client
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

// Transcript event from Pipecat
export interface TranscriptEvent {
  transcript: {
    text: string;
    final: boolean;
  };
  role: "user" | "assistant";
}

// Processing state event from Pipecat
export interface ProcessingStateEvent {
  processing: boolean;
}

// Connection event from Pipecat
export interface ConnectionEvent {
  connected: boolean;
}

// Error event from Pipecat
export interface ErrorEvent {
  error: Error;
  message: string;
}

// Configuration for Pipecat client
export interface PipecatClientConfig {
  apiKey?: string;
  baseUrl: string;
  endpoint: {
    connect: string;
  };
}

// Event types for Pipecat client
export type PipecatEventTypes = 
  | "connected"
  | "disconnected" 
  | "error" 
  | "transcript" 
  | "processingStateChange"
  | string; // Allow string for other event types

// Extended RTVI client interface
export interface ExtendedRTVIClient {
  hasDevicePermissions?: () => boolean;
  requestDevicePermissions?: () => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  muteMicrophone?: () => void;
  unmuteMicrophone?: () => void;
  on(event: PipecatEventTypes, callback: (data: any) => void): void;
  off(event: PipecatEventTypes, callback: (data: any) => void): void;
}