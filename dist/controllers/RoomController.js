"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const logger_1 = __importDefault(require("../util/logs/logger"));
const RoomDao_1 = require("../dao/RoomDao");
const Room_1 = require("../models/dao/Room");
class RoomController {
    roomDao;
    // potentially look into dependency injection container frameworks
    constructor() {
        this.roomDao = new RoomDao_1.RoomDao;
    }
    async getRooms(request, response, next) {
        try {
            logger_1.default.info("Retrieving all rooms");
            const roomDao = new RoomDao_1.RoomDao();
            const rooms = await roomDao.getRooms();
            logger_1.default.info("Number of rooms retrieved successfully: " + rooms.length);
            response.status(200).json(JSON.stringify(rooms));
        }
        catch (error) {
            logger_1.default.error("Error retrieving rooms");
            response.send(error);
        }
    }
    async getRoomByNumber(request, response, next) {
        try {
            logger_1.default.info(`Retrieving room with ID: ${request.params.roomId}`);
            const roomDao = new RoomDao_1.RoomDao();
            const roomNumber = request.params.roomNumber;
            const room = await roomDao.getRoomByNumber(roomNumber);
            logger_1.default.info(`Room retrieved successfully: ${JSON.stringify(room)}`);
            response.status(200).json(JSON.stringify(room));
        }
        catch (error) {
            logger_1.default.error(`Error retrieving room with ${request.params.roomNumber}`);
            response.send(error);
        }
    }
    async createRoom(request, response, next) {
        try {
            logger_1.default.info("Creating new room");
            const roomDao = new RoomDao_1.RoomDao();
            const roomDetails = Room_1.Room.createBaseRoom();
            const newRoom = await roomDao.addRoom(roomDetails);
            logger_1.default.info(`Successfully created room ${newRoom.roomCode}`);
            response.status(200).json(JSON.stringify(newRoom));
        }
        catch (error) {
            logger_1.default.error("Error creating room", error);
            response.send(error);
        }
    }
    async startGame(request, response, next) {
        try {
            logger_1.default.info(`Starting game: ${JSON.stringify(request.body)}`);
            const roomDao = new RoomDao_1.RoomDao();
            const startGameDetails = request.body;
            const room = await roomDao.startGame(startGameDetails);
            response.status(200).json(JSON.stringify(room));
        }
        catch (error) {
            logger_1.default.error("Error updating room", error);
            response.send(error);
        }
    }
    async updateRoom(request, response, next) {
        try {
            logger_1.default.info(`Updating room: ${JSON.stringify(request.body)}`);
            const roomDao = new RoomDao_1.RoomDao();
            const roomId = request.params.roomId;
            const updateRoomDetails = request.body;
            const room = await roomDao.updateRoom(roomId, updateRoomDetails);
            response.status(200).json(JSON.stringify(room));
        }
        catch (error) {
            logger_1.default.error("Error updating room", error);
            response.send(error);
        }
    }
    async joinRoom(request, response, next) {
        try {
            logger_1.default.info(`Player joining room: ${JSON.stringify(request.body)}`);
            const roomDao = new RoomDao_1.RoomDao();
            const joinDetails = request.body;
            const room = await roomDao.joinRoom(joinDetails);
            logger_1.default.info("Player successfully joined room");
            response.status(200).json(JSON.stringify(room));
        }
        catch (error) {
            logger_1.default.error("Error joining room: ", error);
            response.send(error);
        }
    }
    async leaveRoom(request, response, next) {
        try {
            logger_1.default.info(`Player leaving room: ${JSON.stringify(request.body)}`);
            const roomDao = new RoomDao_1.RoomDao();
            const joinDetails = request.body;
            const room = await roomDao.joinRoom(joinDetails);
            logger_1.default.info("Player successfully left room");
            response.status(200).json(JSON.stringify(room));
        }
        catch (error) {
            logger_1.default.error("Error leaving room: ", error);
            response.send(error);
        }
    }
    async deleteRoom(request, response, next) {
        try {
            logger_1.default.info(`Deleting room ${JSON.stringify(request.body)}`);
            const roomDao = new RoomDao_1.RoomDao();
            const room = request.body;
            await roomDao.deleteRoom(room.id);
            logger_1.default.info("Successfully deleted room");
            response.status(200).send("Success");
        }
        catch (error) {
            logger_1.default.error("Error deleting room", error);
            response.send(error);
        }
    }
}
exports.RoomController = RoomController;
