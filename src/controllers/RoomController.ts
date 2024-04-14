import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { RoomDao } from '../dao/RoomDao';
import { Room } from '../models/Room';
import { JoinRoomDetails } from '../models/JoinRoomDetails';
import { CreateRoomDetails } from '../models/CreateRoomDetails';

export class RoomController {

    public roomDao : RoomDao;

    // potentially look into dependency injection container frameworks
    constructor() {
        this.roomDao = new RoomDao;
    }

    async getRooms(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info("Retrieving all rooms");
            const roomDao : RoomDao = new RoomDao();
            const rooms : Array<Room> = await roomDao.getRooms();
            Logger.info("Number of rooms retrieved successfully: " + rooms.length);
            response.status(200).json(JSON.stringify(rooms));
        } catch (error) {
            Logger.error("Error retrieving rooms");
            response.send(error);
        }
    }

    async getRoomByNumber(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving room with ID: ${request.params.roomId}`);
            const roomDao : RoomDao = new RoomDao();
            const roomNumber : string = request.params.roomNumber;
            const room : Room = await roomDao.getRoomByNumber(roomNumber);
            Logger.info(`Room retrieved successfully: ${JSON.stringify(room)}`);
            response.status(200).json(JSON.stringify(room));
        } catch (error) {
            Logger.error(`Error retrieving room with ${request.params.roomNumber}`);
            response.send(error);
        }
    }

    async createRoom(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info("Creating new room");
            const roomDao : RoomDao = new RoomDao();
            const createRoomDetails : CreateRoomDetails = request.body;
            const roomDetails : Room = Room.createBaseRoom(createRoomDetails.playerName);
            roomDetails.id = await roomDao.addRoom(roomDetails);
            Logger.info(`Successfully created room ${roomDetails.roomCode}`);
            response.status(200).json(JSON.stringify(roomDetails));
        } catch (error) {
            Logger.error("Error creating room", error);
            response.send(error);
        }
    }

    async joinRoom(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Player joining room: ${JSON.stringify(request.body)}`);
            const roomDao : RoomDao = new RoomDao();
            const joinDetails : JoinRoomDetails = request.body;
            const room : Room = await roomDao.joinRoom(joinDetails);
            Logger.info("Player successfully joined room");
            response.status(200).json(JSON.stringify(room));
        } catch (error) {
            Logger.error("Error joining room: ", error);
            response.send(error);
        }
    }

    async leaveRoom(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Player leaving room: ${JSON.stringify(request.body)}`);
            const roomDao : RoomDao = new RoomDao();
            const joinDetails : JoinRoomDetails = request.body;
            const room : Room = await roomDao.joinRoom(joinDetails);
            Logger.info("Player successfully left room");
            response.status(200).json(JSON.stringify(room));
        } catch (error) {
            Logger.error("Error leaving room: ", error);
            response.send(error);
        }
    }


    async deleteRoom(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting room ${JSON.stringify(request.body)}`);
            const roomDao : RoomDao = new RoomDao();
            const room : Room = request.body;
            await roomDao.deleteRoom(room.id);
            Logger.info("Successfully deleted room");
            response.status(200).send("Success");
        } catch (error) {
            Logger.error("Error deleting room", error);
            response.send(error);
        }
    }
}
