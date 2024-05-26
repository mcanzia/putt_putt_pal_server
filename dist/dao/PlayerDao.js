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
exports.PlayerDao = void 0;
const firebase_1 = require("../configs/firebase");
const PlayerDTO_1 = require("../models/dto/PlayerDTO");
const CustomError_1 = require("../util/error/CustomError");
const redisClient_1 = __importDefault(require("../redisClient"));
const inversify_1 = require("inversify");
const types_1 = require("../configs/types");
const socket_io_1 = require("socket.io");
let PlayerDao = class PlayerDao {
    io;
    constructor(io) {
        this.io = io;
    }
    async getPlayers(roomId) {
        try {
            const cacheKey = `players:${roomId}`;
            const cachedPlayers = await redisClient_1.default.get(cacheKey);
            if (cachedPlayers) {
                return JSON.parse(cachedPlayers);
            }
            let players = new Map();
            const playersRef = firebase_1.db.ref(`rooms/${roomId}/players`);
            const snapshot = await playersRef.once('value');
            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }
            players = snapshot.val();
            await redisClient_1.default.set(cacheKey, JSON.stringify(players), {
                EX: 60
            });
            return players;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve players from database: " + error);
        }
    }
    async getPlayerById(roomId, playerId) {
        try {
            const cacheKey = `player:${roomId}:${playerId}`;
            const cachedPlayer = await redisClient_1.default.get(cacheKey);
            if (cachedPlayer) {
                return JSON.parse(cachedPlayer);
            }
            const playerRef = firebase_1.db.ref(`rooms/${roomId}/players/${playerId}`);
            const snapshot = await playerRef.once('value');
            if (!snapshot.exists()) {
                throw new Error('No such player found in the specified room.');
            }
            const playerData = snapshot.val();
            const player = new PlayerDTO_1.PlayerDTO(playerId, playerData.name, playerData.isHost, playerData.color);
            await redisClient_1.default.set(cacheKey, JSON.stringify(player), {
                EX: 60
            });
            return player;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve player from database: " + error);
        }
    }
    async addPlayer(roomId, player) {
        try {
            const roomsRef = firebase_1.db.ref('rooms');
            const playersRef = await roomsRef.child(`${roomId}/players`).push();
            player.id = playersRef.key;
            await playersRef.set(player);
            await redisClient_1.default.del(`players:${roomId}`);
            return player;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not add player to database: " + error);
        }
    }
    async updatePlayer(roomId, playerId, updatedPlayer) {
        try {
            const playerRef = firebase_1.db.ref(`rooms/${roomId}/players/${playerId}`);
            await playerRef.update(updatedPlayer);
            await redisClient_1.default.del(`player:${roomId}:${playerId}`);
            await redisClient_1.default.del(`players:${roomId}`);
            const updatedPlayers = await this.getPlayers(roomId);
            return updatedPlayers;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not update player details: " + error);
        }
    }
    async deletePlayer(roomId, playerId) {
        try {
            const playerRef = firebase_1.db.ref(`rooms/${roomId}/players/${playerId}`);
            await playerRef.remove();
            await redisClient_1.default.del(`player:${roomId}:${playerId}`);
            await redisClient_1.default.del(`players:${roomId}`);
            const updatedPlayers = await this.getPlayers(roomId);
            return updatedPlayers;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not delete player from database: " + error);
        }
    }
};
PlayerDao = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SocketIO)),
    __metadata("design:paramtypes", [socket_io_1.Server])
], PlayerDao);
exports.PlayerDao = PlayerDao;
