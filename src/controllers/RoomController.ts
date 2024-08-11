import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { RoomDao } from '../dao/RoomDao';
import { JoinRoomDetails } from '../models/dao/JoinRoomDetails';
import { RoomDTO } from '../models/dto/RoomDTO';
import { TYPES } from '../configs/types';
import { Server } from 'socket.io';
import { CustomError } from '../util/error/CustomError';

@injectable()
export class RoomController {

    constructor(@inject(TYPES.RoomDao) private roomDao: RoomDao, @inject(TYPES.SocketIO) private io: Server) {}

    async getRooms(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info("Retrieving all rooms");
            const rooms : Array<RoomDTO> = await this.roomDao.getRooms();
            response.status(200).json(rooms);
        } catch (error) {
            Logger.error("Error retrieving rooms");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getRoomByNumber(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving room with ID: ${request.params.roomId}`);
            const roomNumber : string = request.params.roomNumber;
            const room : RoomDTO = await this.roomDao.getRoomByNumber(roomNumber);
            response.status(200).json(room);
        } catch (error) {
            Logger.error(`Error retrieving room with ${request.params.roomNumber}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async createRoom(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info("Creating new room");
            const roomDetails : RoomDTO = RoomDTO.createBaseRoom();
            const newRoom : RoomDTO = await this.roomDao.addRoom(roomDetails);
            Logger.info(`Successfully created room ${newRoom.roomCode}`);
            response.status(200).json(newRoom);
        } catch (error) {
            Logger.error("Error creating room", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async startGame(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Starting game: ${JSON.stringify(request.body)}`);
            const startGameDetails : RoomDTO = request.body;
            const room : RoomDTO = await this.roomDao.startGame(startGameDetails);
            this.io.to(room.id).emit('roomUpdated', room);
            this.io.to(room.id).emit('startGame');
            response.status(200).send();
        } catch (error) {
            Logger.error("Error updating room", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updateRoom(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Updating room: ${JSON.stringify(request.body)}`);
            const roomId = request.params.roomId;
            const updateRoomDetails : RoomDTO = request.body;
            const room : RoomDTO = await this.roomDao.updateRoom(roomId, updateRoomDetails);
            this.io.to(room.id).emit('roomUpdated', room);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error updating room", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async joinRoom(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Player joining room: ${JSON.stringify(request.body)}`);
            const joinDetails : JoinRoomDetails = request.body;
            const room : RoomDTO = await this.roomDao.joinRoom(joinDetails);
            this.io.to(room.id).emit('roomUpdated', room.toObject());
            this.io.to(room.id).emit('playerJoined', joinDetails.color);
            response.status(200).json(room.toObject());
        } catch (error) {
            Logger.error("Error joining room: ", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async leaveRoom(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Player leaving room: ${JSON.stringify(request.body)}`);
            const joinDetails : JoinRoomDetails = request.body;
            const room : RoomDTO = await this.roomDao.joinRoom(joinDetails);
            this.io.to(room.id).emit('roomUpdated', room.toObject());
            response.status(200).json(room.toObject());
        } catch (error) {
            Logger.error("Error leaving room: ", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }


    async deleteRoom(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting room ${JSON.stringify(request.body)}`);
            const room : RoomDTO = request.body;
            await this.roomDao.deleteRoom(room.id);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error deleting room", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async resetRoom(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Resetting room: ${JSON.stringify(request.params.roomId)}`);
            const roomId = request.params.roomId;
            const resetRoomDetails : RoomDTO = request.body;
            const room : RoomDTO = await this.roomDao.updateRoom(roomId, resetRoomDetails);
            this.io.to(room.id).emit('resetRoom', room);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error updating room", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteInactiveRooms() {
        try {
            await this.roomDao.checkAndDeleteInactiveRooms();
        } catch (error) {
            Logger.error("Error deleting inactive rooms", error);
        }
    }

    async deleteInactiveRoomsRequest(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting inactive rooms - ${Date.now.toString()}`);
            await this.roomDao.checkAndDeleteInactiveRooms();
            response.status(200).send();
        } catch (error) {
            Logger.error("Error deleting inactive rooms", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

}
