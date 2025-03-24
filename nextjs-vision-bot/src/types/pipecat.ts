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