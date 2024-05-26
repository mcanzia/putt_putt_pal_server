import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { HoleDTO } from "../models/dto/HoleDTO";
import { HoleDao } from '../dao/HoleDao';
import { TYPES } from '../configs/types';
import { Server } from 'socket.io';
import { CustomError } from '../util/error/CustomError';

@injectable()
export class HoleController {

    constructor(@inject(TYPES.HoleDao) private holeDao: HoleDao, @inject(TYPES.SocketIO) private io: Server) {}

    async getHoles(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Retrieving all holes for ${roomId}`);
            const holes : Map<String, HoleDTO> = await this.holeDao.getHoles(roomId);
            Logger.info("Number of holes retrieved successfully: " + holes.values.length);
            response.status(200).json(holes);
        } catch (error) {
            Logger.error("Error retrieving holes");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getHoleById(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Retrieving hole with ID: ${request.params.holeId} from room ${roomId}`);
            const holeId : string = request.params.holeId;
            const hole : HoleDTO = await this.holeDao.getHoleById(roomId, holeId);
            Logger.info(`Hole retrieved successfully: ${JSON.stringify(hole)}`);
            response.status(200).json(hole);
        } catch (error) {
            Logger.error(`Error retrieving hole with id ${request.params.holeId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async addHole(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Adding new hole to room ${roomId}`);
            const hole : HoleDTO = request.body;
            const holeList : Map<String, HoleDTO> = await this.holeDao.addHole(roomId, hole);
            Logger.info(`Successfully added hole ${hole.holeNumber}`);
            response.status(200).json(holeList);
        } catch (error) {
            Logger.error("Error adding hole", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updateHole(request: Request, response: Response, next: NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Updating hole ${JSON.stringify(request.body)} in room ${roomId}`);
            const holeId = request.params.holeId;
            const updateHoleDetails : HoleDTO = request.body;
            const updatedHole : HoleDTO = await this.holeDao.updateHole(roomId, holeId, updateHoleDetails);
            this.io.to(roomId).emit('holeUpdated', updatedHole);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error updating hole", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteHole(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Deleting hole from room ${roomId}`);
            const holeId : string = request.body;
            const holeList : Map<String, HoleDTO> = await this.holeDao.deleteHole(roomId, holeId);
            Logger.info(`Successfully deleted hole ${holeId}`);
            response.status(200).json(holeList);
        } catch (error) {
            Logger.error("Error deleting hole", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

}