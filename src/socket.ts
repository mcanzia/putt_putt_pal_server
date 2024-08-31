import { Server } from 'socket.io';
import { createServer } from 'http';
import express, { Express } from 'express';
import Logger from './util/logs/logger';
import {PlayerRoom} from './models/dao/PlayerRoom';

const app: Express = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const socketRoomMap : Map<string, PlayerRoom> = new Map<string, PlayerRoom>();

io.on('connection', (socket) => {
    socket.on('joinRoom', (data) => {
      socket.join(data.roomId);
      const playerRoom : PlayerRoom = new PlayerRoom(data.roomId, data.playerId);
      socketRoomMap.set(socket.id, playerRoom);
      console.log('ROOM MAP AFTER JOIN', socketRoomMap);
      socket.emit('setSocketId', socket.id);
      Logger.info(`User ${data.playerId} joined room: ${data.roomId} and socket: ${socket.id}`);
    });
  
    socket.on('leaveRoom', (data) => {
      socket.leave(data.roomId);
      socketRoomMap.delete(socket.id);
      console.log('ROOM MAP AFTER LEAVE', socketRoomMap);
      socket.emit('clearSocketId');
      socket.disconnect();
      console.log(`Socket ${socket.id} is still in rooms: `, socket.rooms);
      console.log(`User left room: ${data.roomId}`);
    });

    socket.on('rejoinRoom', (data) => {
      socketRoomMap.delete(data.oldSocketId);
      socket.join(data.roomId);
      const playerRoom : PlayerRoom = new PlayerRoom(data.roomId, data.playerId);
      socketRoomMap.set(socket.id, playerRoom);
      console.log('ROOM MAP AFTER REJOIN', socketRoomMap);
      socket.emit('setSocketId', socket.id);
      Logger.info(`User ${data.playerId} rejoined room: ${data.roomId} and socket: ${socket.id}`);

    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('reconnect', () => {
      console.log('user reconnected');
    });

    // socket.on('callEndGame', (roomId) => {
    //   socket.to(roomId.roomId).emit('endGame');
    // });
  });

  // Handle shutdown
const shutdown = () => {
    console.log('Shutting down server...');
    
    io.sockets.sockets.forEach(socket => {
        socketRoomMap.delete(socket.id);
        socket.emit('clearSocketId');
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

export { io, httpServer, app, socketRoomMap };
