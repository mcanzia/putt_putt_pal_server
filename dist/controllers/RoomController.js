"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const inversify_1 = require("inversify");
const logger_1 = __importDefault(require("../util/logs/logger"));
const RoomDao_1 = require("../dao/RoomDao");
const RoomDTO_1 = require("../models/dto/RoomDTO");
const types_1 = require("../configs/types");
const socket_io_1 = require("socket.io");
let RoomController = class RoomController {
    roomDao;
    io;
    constructor(roomDao, io) {
        this.roomDao = roomDao;
        this.io = io;
    }
    async getRooms(request, response, next) {
        try {
            logger_1.default.info("Retrieving all rooms");
            const rooms = await this.roomDao.getRooms();
            response.status(200).json(rooms);
        }
        catch (error) {
            logger_1.default.error("Error retrieving rooms");
            response.status(error.statusCode).send(error.message);
        }
    }
    async getRoomByNumber(request, response, next) {
        try {
            logger_1.default.info(`Retrieving room with ID: ${request.params.roomId}`);
            const roomNumber = request.params.roomNumber;
            const room = await this.roomDao.getRoomByNumber(roomNumber);
            response.status(200).json(room);
        }
        catch (error) {
            logger_1.default.error(`Error retrieving room with ${request.params.roomNumber}`);
            response.status(error.statusCode).send(error.message);
        }
    }
    async createRoom(request, response, next) {
        try {
            logger_1.default.info("Creating new room");
            const roomDetails = RoomDTO_1.RoomDTO.createBaseRoom();
            const newRoom = await this.roomDao.addRoom(roomDetails);
            logger_1.default.info(`Successfully created room ${newRoom.roomCode}`);
            response.status(200).json(newRoom);
        }
        catch (error) {
            logger_1.default.error("Error creating room", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async startGame(request, response, next) {
        try {
            logger_1.default.info(`Starting game: ${JSON.stringify(request.body)}`);
            const startGameDetails = request.body;
            const room = await this.roomDao.startGame(startGameDetails);
            this.io.to(room.id).emit('roomUpdated', room);
            this.io.to(room.id).emit('startGame');
            response.status(200).send();
        }
        catch (error) {
            logger_1.default.error("Error updating room", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async updateRoom(request, response, next) {
        try {
            logger_1.default.info(`Updating room: ${JSON.stringify(request.body)}`);
            const roomId = request.params.roomId;
            const updateRoomDetails = request.body;
            const room = await this.roomDao.updateRoom(roomId, updateRoomDetails);
            this.io.to(room.id).emit('roomUpdated', room);
            response.status(200).send();
        }
        catch (error) {
            logger_1.default.error("Error updating room", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async joinRoom(request, response, next) {
        try {
            logger_1.default.info(`Player joining room: ${JSON.stringify(request.body)}`);
            const joinDetails = request.body;
            const room = await this.roomDao.joinRoom(joinDetails);
            this.io.to(room.id).emit('roomUpdated', room.toObject());
            response.status(200).json(room.toObject());
        }
        catch (error) {
            logger_1.default.error("Error joining room: ", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async leaveRoom(request, response, next) {
        try {
            logger_1.default.info(`Player leaving room: ${JSON.stringify(request.body)}`);
            const joinDetails = request.body;
            const room = await this.roomDao.joinRoom(joinDetails);
            this.io.to(room.id).emit('roomUpdated', room.toObject());
            response.status(200).json(room.toObject());
        }
        catch (error) {
            logger_1.default.error("Error leaving room: ", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async deleteRoom(request, response, next) {
        try {
            logger_1.default.info(`Deleting room ${JSON.stringify(request.body)}`);
            const room = request.body;
            await this.roomDao.deleteRoom(room.id);
            response.status(200).send();
        }
        catch (error) {
            logger_1.default.error("Error deleting room", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async resetRoom(request, response, next) {
        try {
            logger_1.default.info(`Resetting room: ${JSON.stringify(request.params.roomId)}`);
            const roomId = request.params.roomId;
            const resetRoomDetails = request.body;
            const room = await this.roomDao.updateRoom(roomId, resetRoomDetails);
            this.io.to(room.id).emit('resetRoom', room);
            response.status(200).send();
        }
        catch (error) {
            logger_1.default.error("Error updating room", error);
            response.status(error.statusCode).send(error.message);
        }
    }
};
RoomController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.RoomDao)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.SocketIO)),
    __metadata("design:paramtypes", [RoomDao_1.RoomDao, socket_io_1.Server])
], RoomController);
exports.RoomController = RoomController;
