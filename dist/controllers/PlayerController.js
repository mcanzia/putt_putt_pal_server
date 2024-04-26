"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const logger_1 = __importDefault(require("../util/logs/logger"));
const PlayerDao_1 = require("../dao/PlayerDao");
class PlayerController {
    playerDao;
    constructor() {
        this.playerDao = new PlayerDao_1.PlayerDao;
    }
    async getPlayers(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Retrieving all players for ${roomId}`);
            const playerDao = new PlayerDao_1.PlayerDao();
            const players = await playerDao.getPlayers(roomId);
            logger_1.default.info("Number of players retrieved successfully: " + players.length);
            response.status(200).json(JSON.stringify(players));
        }
        catch (error) {
            logger_1.default.error("Error retrieving players");
            response.send(error);
        }
    }
    async getPlayerById(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Retrieving player with ID: ${request.params.playerId} from room ${roomId}`);
            const playerDao = new PlayerDao_1.PlayerDao();
            const playerId = request.params.playerId;
            const player = await playerDao.getPlayerById(roomId, playerId);
            logger_1.default.info(`Player retrieved successfully: ${JSON.stringify(player)}`);
            response.status(200).json(JSON.stringify(player));
        }
        catch (error) {
            logger_1.default.error(`Error retrieving player with id ${request.params.playerId}`);
            response.send(error);
        }
    }
    async addPlayer(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Adding new player to room ${roomId}`);
            const playerDao = new PlayerDao_1.PlayerDao();
            const player = request.body;
            const playerList = await playerDao.addPlayer(roomId, player);
            logger_1.default.info(`Successfully added player ${player.name}`);
            response.status(200).json(JSON.stringify(playerList));
        }
        catch (error) {
            logger_1.default.error("Error adding player", error);
            response.send(error);
        }
    }
    async updatePlayer(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Updating player ${JSON.stringify(request.body)} in room ${roomId}`);
            const playerDao = new PlayerDao_1.PlayerDao();
            const playerId = request.params.playerId;
            const updatePlayerDetails = request.body;
            const playerList = await playerDao.updatePlayer(roomId, playerId, updatePlayerDetails);
            response.status(200).json(JSON.stringify(playerList));
        }
        catch (error) {
            logger_1.default.error("Error updating player", error);
            response.send(error);
        }
    }
    async deletePlayer(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Deleting player from room ${roomId}`);
            const playerDao = new PlayerDao_1.PlayerDao();
            const playerId = request.body;
            const playerList = await playerDao.deletePlayer(roomId, playerId);
            logger_1.default.info(`Successfully deleted player ${playerId}`);
            response.status(200).json(JSON.stringify(playerList));
        }
        catch (error) {
            logger_1.default.error("Error deleting player", error);
            response.send(error);
        }
    }
}
exports.PlayerController = PlayerController;
