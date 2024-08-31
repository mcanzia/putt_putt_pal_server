import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from "inversify";
import Logger from "../util/logs/logger";
import { socketRoomMap, io } from '../socket';
import { PlayerRoom } from '../models/dao/PlayerRoom';
import { RoomDao } from '../dao/RoomDao';
import { TYPES } from '../configs/types';
import { PlayerDao } from '../dao/PlayerDao';
import { RoomDTO } from '../models/dto/RoomDTO';
import { PlayerDTO } from '../models/dto/PlayerDTO';
import { PlayerColorDTO } from '../models/dto/PlayerColorDTO';
import { PlayerNotFoundError, RoomNotFoundError } from '../util/error/CustomError';

@injectable()
export class SocketController {

    constructor(@inject(TYPES.RoomDao) private roomDao: RoomDao, @inject(TYPES.PlayerDao) private playerDao: PlayerDao) { }

    async checkSocketConnection(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Checking socket connection ${request.body.socketId}`);
            const socketId: string = request.body.socketId;
            // const isSocketActive = io.sockets.sockets.has(socketId);
            console.log('ROOM MAP', socketRoomMap);
            const playerRoom: PlayerRoom | undefined = socketRoomMap.get(socketId);
            if (!!playerRoom) {
                Logger.info(`Found existing room code ${playerRoom.roomId} and player ${playerRoom.playerId}`);
                const room: RoomDTO = await this.roomDao.getRoomById(playerRoom.roomId);
                const player: PlayerDTO = playerRoom.playerId === 'host' ?
                    await this.playerDao.getHostPlayer(playerRoom.roomId) : await this.playerDao.getPlayerById(playerRoom.roomId, playerRoom.playerId);
                const playerColors: Array<PlayerColorDTO> = PlayerColorDTO.createBaseColors();
                
                response.status(200).json({ connected: true, room: room, player: player, playerColors: playerColors });
            } else {
                Logger.info(`No existing room code, disconnecting socket ${socketId}`);
                const socket = io.sockets.sockets.get(socketId);
                socket?.disconnect(true);
                response.status(200).json({ connected: false });
            }
        } catch (error) {
            if (error instanceof RoomNotFoundError || error instanceof PlayerNotFoundError) {
                Logger.info(`${error}`);
                const socket = io.sockets.sockets.get(request.body.socketId);
                socket?.disconnect(true);
                response.status(200).json({ connected: false });
            } else {
                Logger.error(`Error checking socket connection - ${error}`);
                response.status(200).json({ connected: false });
            }
        }
    }
}