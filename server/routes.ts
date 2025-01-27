import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocket, WebSocketServer } from 'ws';

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws',
    verifyClient: (info, cb) => {
      if (info.req.headers['sec-websocket-protocol'] === 'vite-hmr') {
        cb(false);
        return;
      }
      cb(true);
    }
  });

  // Handle WebSocket connections for real-time updates
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to simulation websocket');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        switch (data.type) {
          case 'START_SIMULATION':
            // Broadcast simulation start
            wss.clients.forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'SIMULATION_STARTED' }));
              }
            });
            break;
            
          case 'STOP_SIMULATION':
            // Broadcast simulation stop
            wss.clients.forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'SIMULATION_STOPPED' }));
              }
            });
            break;
            
          case 'UPDATE_METRICS':
            // Broadcast metric updates
            wss.clients.forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'METRICS_UPDATED',
                  data: data.metrics
                }));
              }
            });
            break;
        }
      } catch (err) {
        console.error('Error processing websocket message:', err);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from simulation websocket');
    });
  });

  // REST API routes
  app.get('/api/simulation/state', (_req, res) => {
    res.json({
      status: 'active',
      metrics: {
        ipc: Math.random() * 2,
        cpi: 1 + Math.random(),
        branchMispredictions: Math.floor(Math.random() * 100),
        cacheMisses: Math.floor(Math.random() * 200)
      }
    });
  });

  return httpServer;
}
