"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoleController = void 0;
const logger_1 = __importDefault(require("../util/logs/logger"));
const HoleDao_1 = require("../dao/HoleDao");
class HoleController {
    holeDao;
    constructor() {
        this.holeDao = new HoleDao_1.HoleDao;
    }
    async getHoles(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Retrieving all holes for ${roomId}`);
            const holeDao = new HoleDao_1.HoleDao();
            const holes = await holeDao.getHoles(roomId);
            logger_1.default.info("Number of holes retrieved successfully: " + holes.values.length);
            response.status(200).json(holes);
        }
        catch (error) {
            logger_1.default.error("Error retrieving holes");
            response.send(error);
        }
    }
    async getHoleById(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Retrieving hole with ID: ${request.params.holeId} from room ${roomId}`);
            const holeDao = new HoleDao_1.HoleDao();
            const holeId = request.params.holeId;
            const hole = await holeDao.getHoleById(roomId, holeId);
            logger_1.default.info(`Hole retrieved successfully: ${JSON.stringify(hole)}`);
            response.status(200).json(hole);
        }
        catch (error) {
            logger_1.default.error(`Error retrieving hole with id ${request.params.holeId}`);
            response.send(error);
        }
    }
    async addHole(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Adding new hole to room ${roomId}`);
            const holeDao = new HoleDao_1.HoleDao();
            const hole = request.body;
            const holeList = await holeDao.addHole(roomId, hole);
            logger_1.default.info(`Successfully added hole ${hole.holeNumber}`);
            response.status(200).json(holeList);
        }
        catch (error) {
            logger_1.default.error("Error adding hole", error);
            response.send(error);
        }
    }
    async updateHole(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Updating hole ${JSON.stringify(request.body)} in room ${roomId}`);
            const holeDao = new HoleDao_1.HoleDao();
            const holeId = request.params.holeId;
            const updateHoleDetails = request.body;
            const holeList = await holeDao.updateHole(roomId, holeId, updateHoleDetails);
            response.status(200).json(holeList);
        }
        catch (error) {
            logger_1.default.error("Error updating hole", error);
            response.send(error);
        }
    }
    async deleteHole(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Deleting hole from room ${roomId}`);
            const holeDao = new HoleDao_1.HoleDao();
            const holeId = request.body;
            const holeList = await holeDao.deleteHole(roomId, holeId);
            logger_1.default.info(`Successfully deleted hole ${holeId}`);
            response.status(200).json(holeList);
        }
        catch (error) {
            logger_1.default.error("Error deleting hole", error);
            response.send(error);
        }
    }
}
exports.HoleController = HoleController;
