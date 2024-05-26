"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.httpServer = exports.io = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./util/logs/logger"));
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
exports.io = io;
io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId.roomId);
        logger_1.default.info(`User joined room: ${roomId.roomId}`);
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
