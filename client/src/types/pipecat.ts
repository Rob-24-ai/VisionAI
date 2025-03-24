// Connection status types
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

// Pipecat event types (can be expanded as needed)
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

// Client configuration types
export interface PipecatClientConfig {
  apiKey?: string;
  baseUrl: string;
  endpoint: {
    connect: string;
  };
}
