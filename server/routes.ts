import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Pipecat Cloud API proxy endpoints
  app.post("/api/connect", async (req, res) => {
    try {
      // This endpoint would normally proxy to Pipecat Cloud
      // For now, we'll just return a valid response format
      res.json({
        success: true,
        session: {
          id: "pipecat-session-" + Date.now(),
          token: "mock-token",
        }
      });
    } catch (error) {
      console.error("Error connecting to Pipecat:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to connect to Pipecat Cloud" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
