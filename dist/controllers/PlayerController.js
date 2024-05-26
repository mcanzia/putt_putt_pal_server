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
exports.PlayerController = void 0;
const inversify_1 = require("inversify");
const logger_1 = __importDefault(require("../util/logs/logger"));
const PlayerDao_1 = require("../dao/PlayerDao");
const types_1 = require("../configs/types");
const socket_io_1 = require("socket.io");
let PlayerController = class PlayerController {
    playerDao;
    io;
    constructor(playerDao, io) {
        this.playerDao = playerDao;
        this.io = io;
    }
    async getPlayers(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Retrieving all players for ${roomId}`);
            const players = await this.playerDao.getPlayers(roomId);
            logger_1.default.info("Number of players retrieved successfully: " + players.entries.length);
            response.status(200).json(players);
        }
        catch (error) {
            logger_1.default.error("Error retrieving players");
            response.status(error.statusCode).send(error.message);
        }
    }
    async getPlayerById(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Retrieving player with ID: ${request.params.playerId} from room ${roomId}`);
            const playerId = request.params.playerId;
            const player = await this.playerDao.getPlayerById(roomId, playerId);
            logger_1.default.info(`Player retrieved successfully: ${JSON.stringify(player)}`);
            response.status(200).json(player);
        }
        catch (error) {
            logger_1.default.error(`Error retrieving player with id ${request.params.playerId}`);
            response.status(error.statusCode).send(error.message);
        }
    }
    async addPlayer(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Adding new player to room ${roomId}`);
            const player = request.body;
            const newPlayer = await this.playerDao.addPlayer(roomId, player);
            logger_1.default.info(`Successfully added player ${newPlayer.name}`);
            const playerList = await this.playerDao.getPlayers(roomId);
            this.io.to(roomId).emit('playerListUpdated', playerList);
            response.status(200).json(newPlayer);
        }
        catch (error) {
            logger_1.default.error("Error adding player", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async updatePlayer(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Updating player ${JSON.stringify(request.body)} in room ${roomId}`);
            const playerId = request.params.playerId;
            const updatePlayerDetails = request.body;
            const playerList = await this.playerDao.updatePlayer(roomId, playerId, updatePlayerDetails);
            this.io.to(roomId).emit('playerListUpdated', playerList);
            response.status(200).send();
        }
        catch (error) {
            logger_1.default.error("Error updating player", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async deletePlayer(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Deleting player from room ${roomId}`);
            const player = request.body;
            const playerList = await this.playerDao.deletePlayer(roomId, player.id);
            logger_1.default.info(`Successfully deleted player ${player.id}`);
            this.io.to(roomId).emit('playerListUpdated', playerList);
            response.status(200).send();
        }
        catch (error) {
            logger_1.default.error("Error deleting player", error);
            response.status(error.statusCode).send(error.message);
        }
    }
};
PlayerController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PlayerDao)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.SocketIO)),
    __metadata("design:paramtypes", [PlayerDao_1.PlayerDao, socket_io_1.Server])
], PlayerController);
exports.PlayerController = PlayerController;
