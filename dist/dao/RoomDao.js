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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDao = void 0;
const firebase_1 = require("../configs/firebase");
const CustomError_1 = require("../util/error/CustomError");
const PlayerDTO_1 = require("../models/dto/PlayerDTO");
const RoomDTO_1 = require("../models/dto/RoomDTO");
const redisClient_1 = __importDefault(require("../redisClient"));
const lodash_1 = __importDefault(require("lodash"));
const PlayerScoreDTO_1 = require("../models/dto/PlayerScoreDTO");
const inversify_1 = require("inversify");
let RoomDao = class RoomDao {
    constructor() { }
    async getRooms() {
        try {
            const cacheKey = 'rooms';
            const cachedRooms = await redisClient_1.default.get(cacheKey);
            if (cachedRooms) {
                return JSON.parse(cachedRooms);
            }
            const roomsRef = firebase_1.db.ref('rooms');
            const snapshot = await roomsRef.once('value');
            const roomsData = snapshot.val();
            const rooms = [];
            if (roomsData) {
                Object.keys(roomsData).forEach(key => {
                    const currentRoom = roomsData[key];
                    const room = new RoomDTO_1.RoomDTO(key, currentRoom.roomCode, currentRoom.players, currentRoom.holes, currentRoom.allPlayersJoined, currentRoom.numberOfHoles);
                    rooms.push(room);
                });
            }
            await redisClient_1.default.set(cacheKey, JSON.stringify(rooms), {
                EX: 60
            });
            return rooms;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve rooms from database: " + error);
        }
    }
    async getRoomByNumber(roomNumber) {
        try {
            const cacheKey = `room:${roomNumber}`;
            const cachedRoom = await redisClient_1.default.get(cacheKey);
            if (cachedRoom) {
                return JSON.parse(cachedRoom);
            }
            const roomsRef = firebase_1.db.ref('rooms');
            const snapshot = await roomsRef.orderByChild('roomNumber').equalTo(roomNumber).once('value');
            const roomObject = snapshot.val();
            if (!roomObject) {
                throw new Error('Room not found');
            }
            const roomId = Object.keys(roomObject)[0];
            const roomData = roomObject[roomId];
            const room = new RoomDTO_1.RoomDTO(roomId, roomData.roomCode, roomData.players, roomData.holes, roomData.allPlayersJoined, roomData.numberOfHoles);
            await redisClient_1.default.set(cacheKey, JSON.stringify(room), {
                EX: 60
            });
            return room;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve room from database: " + error);
        }
    }
    async addRoom(room) {
        try {
            const roomsRef = firebase_1.db.ref('rooms');
            const newRoomRef = roomsRef.push();
            room.id = newRoomRef.key;
            await newRoomRef.set(room);
            await redisClient_1.default.del('rooms');
            const newRoomSnapshot = await roomsRef.child(newRoomRef.key).once('value');
            const newRoom = newRoomSnapshot.val();
            return { ...newRoom, players: room.players };
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not add room to database: " + error);
        }
    }
    async startGame(startGameDetails) {
        try {
            const roomsRef = firebase_1.db.ref('rooms');
            const roomSnapshot = await roomsRef.child(startGameDetails.id).once('value');
            const room = roomSnapshot.val();
            if (!room) {
                throw new Error('Room not found');
            }
            const holesRef = roomsRef.child(`${startGameDetails.id}/holes`);
            const newHoles = Array.from({ length: startGameDetails.numberOfHoles }, (_, index) => {
                const holeNumber = index + 1;
                const playerScores = [];
                Object.entries(room.players).forEach(([key]) => {
                    const playerScoreRef = holesRef.push();
                    playerScores.push(new PlayerScoreDTO_1.PlayerScoreDTO(playerScoreRef.key, 0, key));
                });
                const holeRef = holesRef.push();
                return {
                    id: holeRef.key,
                    holeNumber: holeNumber,
                    playerScores: playerScores
                };
            });
            for (const hole of newHoles) {
                await holesRef.child(hole.id).set(hole);
            }
            await roomsRef.child(startGameDetails.id).update({
                numberOfHoles: startGameDetails.numberOfHoles
            });
            await redisClient_1.default.del(`room:${room.roomCode}`);
            await redisClient_1.default.del('rooms');
            const updatedRoomSnapshot = await roomsRef.child(startGameDetails.id).once('value');
            const updatedRoomData = updatedRoomSnapshot.val();
            return updatedRoomData;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not start game: " + error);
        }
    }
    async updateRoom(roomId, updatedRoom) {
        try {
            const roomsRef = firebase_1.db.ref('rooms');
            const roomRef = roomsRef.child(roomId);
            const roomCopy = lodash_1.default.cloneDeep(updatedRoom);
            if (updatedRoom.players) {
                delete updatedRoom.players;
            }
            await roomRef.update(updatedRoom);
            const updates = {};
            Object.entries(roomCopy.players).forEach(([key, value]) => {
                updates[`/rooms/${roomId}/players/${key}`] = value;
            });
            await firebase_1.db.ref().update(updates);
            await redisClient_1.default.del(`room:${roomCopy.roomCode}`);
            await redisClient_1.default.del('rooms');
            const updatedRoomSnapshot = await roomRef.once('value');
            const updatedRoomData = updatedRoomSnapshot.val();
            return updatedRoomData;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not update room details: " + error);
        }
    }
    async joinRoom(joinDetails) {
        try {
            const roomsRef = firebase_1.db.ref('rooms');
            const querySnapshot = await roomsRef.orderByChild('roomCode').equalTo(joinDetails.roomCode).once('value');
            if (!querySnapshot.exists()) {
                throw new CustomError_1.NotFoundError('Room with the specified code does not exist.');
            }
            const roomKey = Object.keys(querySnapshot.val())[0];
            const roomData = querySnapshot.val()[roomKey];
            const room = new RoomDTO_1.RoomDTO(roomKey, roomData.roomCode, new Map(Object.entries(roomData.players || {})), new Map(Object.entries(roomData.holes || {})), roomData.allPlayersJoined, roomData.numberOfHoles);
            for (const player of room.players.values()) {
                if (player.name === joinDetails.playerName) {
                    throw new CustomError_1.DuplicateNameError(`Player with the name ${joinDetails.playerName} already exists in the room.`);
                }
            }
            const playerRef = roomsRef.child(`${roomKey}/players`).push();
            const playerData = new PlayerDTO_1.PlayerDTO(playerRef.key, joinDetails.playerName, joinDetails.isHost, joinDetails.color);
            await playerRef.set(playerData);
            room.players.set(playerData.id, playerData);
            await redisClient_1.default.del(`players:${roomKey}`);
            await redisClient_1.default.del(`room:${room.roomCode}`);
            await redisClient_1.default.del('rooms');
            return room;
        }
        catch (error) {
            throw error;
        }
    }
    async leaveRoom(leaveDetails) {
        try {
            const roomsRef = firebase_1.db.ref('rooms');
            const querySnapshot = await roomsRef.orderByChild('roomCode').equalTo(leaveDetails.roomCode).once('value');
            if (!querySnapshot.exists()) {
                throw new Error('Room with the specified code does not exist.');
            }
            const roomKey = Object.keys(querySnapshot.val())[0];
            const roomData = { roomKey, ...querySnapshot.val()[roomKey] };
            const room = new RoomDTO_1.RoomDTO(roomKey, roomData.roomCode, new Map(Object.entries(roomData.players || {})), new Map(Object.entries(roomData.holes || {})), roomData.allPlayersJoined, roomData.numberOfHoles);
            const playersRef = roomsRef.child(`${roomKey}/players`);
            const playerSnapshot = await playersRef.orderByKey().equalTo(leaveDetails.player.id).once('value');
            if (!playerSnapshot.exists()) {
                throw new Error('Player not found in the room.');
            }
            await playersRef.child(leaveDetails.player.id).remove();
            room.players.delete(leaveDetails.player.id);
            await redisClient_1.default.del(`players:${roomKey}`);
            await redisClient_1.default.del(`room:${room.roomCode}`);
            await redisClient_1.default.del('rooms');
            return room;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not leave room: " + error);
        }
    }
    async deleteRoom(roomId) {
        try {
            const roomRef = firebase_1.db.ref(`rooms/${roomId}`);
            const roomSnapshot = await roomRef.once('value');
            const roomData = roomSnapshot.val();
            await roomRef.remove();
            await redisClient_1.default.del(`room:${roomData.roomCode}`);
            await redisClient_1.default.del('rooms');
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not delete room from database: " + error);
        }
    }
};
RoomDao = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], RoomDao);
exports.RoomDao = RoomDao;
