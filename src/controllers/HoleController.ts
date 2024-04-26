import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { HoleDTO } from "../models/dto/HoleDTO";
import { HoleDao } from '../dao/HoleDao';
import { Hole } from '../models/dao/Hole';


export class HoleController {

    public holeDao : HoleDao;

    constructor() {
        this.holeDao = new HoleDao;
    }

    async getHoles(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Retrieving all holes for ${roomId}`);
            const holeDao : HoleDao = new HoleDao();
            const holes : Array<HoleDTO> = await holeDao.getHoles(roomId);
            Logger.info("Number of holes retrieved successfully: " + holes.length);
            response.status(200).json(JSON.stringify(holes));
        } catch (error) {
            Logger.error("Error retrieving holes");
            response.send(error);
        }
    }

    async getHoleById(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Retrieving hole with ID: ${request.params.holeId} from room ${roomId}`);
            const holeDao : HoleDao = new HoleDao();
            const holeId : string = request.params.holeId;
            const hole : HoleDTO = await holeDao.getHoleById(roomId, holeId);
            Logger.info(`Hole retrieved successfully: ${JSON.stringify(hole)}`);
            response.status(200).json(JSON.stringify(hole));
        } catch (error) {
            Logger.error(`Error retrieving hole with id ${request.params.holeId}`);
            response.send(error);
        }
    }

    async addHole(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Adding new hole to room ${roomId}`);
            const holeDao : HoleDao = new HoleDao();
            const hole : Hole = request.body;
            const holeList : Array<HoleDTO> = await holeDao.addHole(roomId, hole);
            Logger.info(`Successfully added hole ${hole.holeNumber}`);
            response.status(200).json(JSON.stringify(holeList));
        } catch (error) {
            Logger.error("Error adding hole", error);
            response.send(error);
        }
    }

    async updateHole(request: Request, response: Response, next: NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Updating hole ${JSON.stringify(request.body)} in room ${roomId}`);
            const holeDao : HoleDao = new HoleDao();
            const holeId = request.params.holeId;
            const updateHoleDetails : Hole = request.body;
            const holeList : Array<Hole> = await holeDao.updateHole(roomId, holeId, updateHoleDetails);
            response.status(200).json(JSON.stringify(holeList));
        } catch (error) {
            Logger.error("Error updating hole", error);
            response.send(error);
        }
    }

    async deleteHole(request : Request, response : Response, next : NextFunction) {
        try {
            const roomId = response.locals.roomId;
            Logger.info(`Deleting hole from room ${roomId}`);
            const holeDao : HoleDao = new HoleDao();
            const holeId : string = request.body;
            const holeList : Array<HoleDTO> = await holeDao.deleteHole(roomId, holeId);
            Logger.info(`Successfully deleted hole ${holeId}`);
            response.status(200).json(JSON.stringify(holeList));
        } catch (error) {
            Logger.error("Error deleting hole", error);
            response.send(error);
        }
    }

}