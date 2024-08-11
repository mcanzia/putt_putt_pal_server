import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { PlayerDTO } from "../models/dto/PlayerDTO";
import { PlayerDao } from '../dao/PlayerDao';
import { TYPES } from '../configs/types';
import { Server } from 'socket.io';
import { CustomError } from '../util/error/CustomError';

@injectable()
export class PlayerController {

    constructor(@inject(TYPES.PlayerDao) private playerDao: PlayerDao, @inject(TYPES.SocketIO) private io: Server) {}

    async getPlayers(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Retrieving all players for ${roomId}`);
            const players : Map<String, PlayerDTO> = await this.playerDao.getPlayers(roomId);
            Logger.info("Number of players retrieved successfully: " + players.entries.length);
            response.status(200).json(players);
        } catch (error) {
            Logger.error("Error retrieving players");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getPlayerById(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Retrieving player with ID: ${request.params.playerId} from room ${roomId}`);
            const playerId : string = request.params.playerId;
            const player : PlayerDTO = await this.playerDao.getPlayerById(roomId, playerId);
            Logger.info(`Player retrieved successfully: ${JSON.stringify(player)}`);
            response.status(200).json(player);
        } catch (error) {
            Logger.error(`Error retrieving player with id ${request.params.playerId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async addPlayer(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Adding new player to room ${roomId}`);
            const player: PlayerDTO = request.body;
            const newPlayer : PlayerDTO = await this.playerDao.addPlayer(roomId, player);
            Logger.info(`Successfully added player ${newPlayer.name}`);
            const playerList : Map<String, PlayerDTO> = await this.playerDao.getPlayers(roomId);
            this.io.to(roomId).emit('playerListUpdated', playerList);
            response.status(200).json(newPlayer);
        } catch (error) {
            Logger.error("Error adding player", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updatePlayer(request: Request, response: Response, next: NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Updating player ${JSON.stringify(request.body)} in room ${roomId}`);
            const playerId = request.params.playerId;
            const updatePlayerDetails : PlayerDTO = request.body;
            const playerList : Map<String, PlayerDTO> = await this.playerDao.updatePlayer(roomId, playerId, updatePlayerDetails);
            this.io.to(roomId).emit('playerListUpdated', playerList);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error updating player", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deletePlayer(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Deleting player from room ${roomId}`);
            const player : PlayerDTO = request.body;
            const playerList : Map<String, PlayerDTO> = await this.playerDao.deletePlayer(roomId, player.id);
            Logger.info(`Successfully deleted player ${player.id}`);
            this.io.to(roomId).emit('playerListUpdated', playerList);
            this.io.to(roomId).emit('playerDeleted', player);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error deleting player", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

}