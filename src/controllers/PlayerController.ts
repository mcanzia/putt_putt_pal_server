import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { PlayerDTO } from "../models/dto/PlayerDTO";
import { PlayerDao } from '../dao/PlayerDao';
import { Player } from '../models/dao/Player';


export class PlayerController {

    public playerDao : PlayerDao;

    constructor() {
        this.playerDao = new PlayerDao;
    }

    async getPlayers(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Retrieving all players for ${roomId}`);
            const playerDao : PlayerDao = new PlayerDao();
            const players : Map<String, PlayerDTO> = await playerDao.getPlayers(roomId);
            Logger.info("Number of players retrieved successfully: " + players.entries.length);
            response.status(200).json(players);
        } catch (error) {
            Logger.error("Error retrieving players");
            response.send(error);
        }
    }

    async getPlayerById(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Retrieving player with ID: ${request.params.playerId} from room ${roomId}`);
            const playerDao : PlayerDao = new PlayerDao();
            const playerId : string = request.params.playerId;
            const player : PlayerDTO = await playerDao.getPlayerById(roomId, playerId);
            Logger.info(`Player retrieved successfully: ${JSON.stringify(player)}`);
            response.status(200).json(player);
        } catch (error) {
            Logger.error(`Error retrieving player with id ${request.params.playerId}`);
            response.send(error);
        }
    }

    async addPlayer(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Adding new player to room ${roomId}`);
            const playerDao : PlayerDao = new PlayerDao();
            const player: PlayerDTO = request.body;
            const playerList : Map<String, PlayerDTO> = await playerDao.addPlayer(roomId, player);
            Logger.info(`Successfully added player ${player.name}`);
            response.status(200).json(playerList);
        } catch (error) {
            Logger.error("Error adding player", error);
            response.send(error);
        }
    }

    async updatePlayer(request: Request, response: Response, next: NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Updating player ${JSON.stringify(request.body)} in room ${roomId}`);
            const playerDao : PlayerDao = new PlayerDao();
            const playerId = request.params.playerId;
            const updatePlayerDetails : PlayerDTO = request.body;
            const playerList : Map<String, PlayerDTO> = await playerDao.updatePlayer(roomId, playerId, updatePlayerDetails);
            response.status(200).json(playerList);
        } catch (error) {
            Logger.error("Error updating player", error);
            response.send(error);
        }
    }

    async deletePlayer(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Deleting player from room ${roomId}`);
            const playerDao : PlayerDao = new PlayerDao();
            const player : PlayerDTO = request.body;
            const playerList : Map<String, PlayerDTO> = await playerDao.deletePlayer(roomId, player.id);
            Logger.info(`Successfully deleted player ${player.id}`);
            response.status(200).json(playerList);
        } catch (error) {
            Logger.error("Error deleting player", error);
            response.send(error);
        }
    }

}