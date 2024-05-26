import { Server } from 'socket.io';
import { createServer } from 'http';
import express, { Express } from 'express';
import Logger from './util/logs/logger';

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on('connection', (socket) => {  
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId.roomId);
      Logger.info(`User joined room: ${roomId.roomId}`);
    });
  
    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`User left room: ${roomId}`);
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('callEndGame', (roomId) => {
      socket.to(roomId.roomId).emit('endGame');
    });
  });

  // Handle shutdown
const shutdown = () => {
    console.log('Shutting down server...');
    
    io.sockets.sockets.forEach(socket => {
        socket.disconnect(true);
    });
  
    httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
  
    setTimeout(() => {
        console.error('Forcing server shutdown...');
        process.exit(1);
    }, 5000);
  };
  
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

export { io, httpServer, app };
