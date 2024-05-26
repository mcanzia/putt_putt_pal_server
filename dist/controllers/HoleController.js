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
exports.HoleController = void 0;
const inversify_1 = require("inversify");
const logger_1 = __importDefault(require("../util/logs/logger"));
const HoleDao_1 = require("../dao/HoleDao");
const types_1 = require("../configs/types");
const socket_io_1 = require("socket.io");
let HoleController = class HoleController {
    holeDao;
    io;
    constructor(holeDao, io) {
        this.holeDao = holeDao;
        this.io = io;
    }
    async getHoles(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Retrieving all holes for ${roomId}`);
            const holes = await this.holeDao.getHoles(roomId);
            logger_1.default.info("Number of holes retrieved successfully: " + holes.values.length);
            response.status(200).json(holes);
        }
        catch (error) {
            logger_1.default.error("Error retrieving holes");
            response.status(error.statusCode).send(error.message);
        }
    }
    async getHoleById(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Retrieving hole with ID: ${request.params.holeId} from room ${roomId}`);
            const holeId = request.params.holeId;
            const hole = await this.holeDao.getHoleById(roomId, holeId);
            logger_1.default.info(`Hole retrieved successfully: ${JSON.stringify(hole)}`);
            response.status(200).json(hole);
        }
        catch (error) {
            logger_1.default.error(`Error retrieving hole with id ${request.params.holeId}`);
            response.status(error.statusCode).send(error.message);
        }
    }
    async addHole(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Adding new hole to room ${roomId}`);
            const hole = request.body;
            const holeList = await this.holeDao.addHole(roomId, hole);
            logger_1.default.info(`Successfully added hole ${hole.holeNumber}`);
            response.status(200).json(holeList);
        }
        catch (error) {
            logger_1.default.error("Error adding hole", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async updateHole(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Updating hole ${JSON.stringify(request.body)} in room ${roomId}`);
            const holeId = request.params.holeId;
            const updateHoleDetails = request.body;
            const updatedHole = await this.holeDao.updateHole(roomId, holeId, updateHoleDetails);
            this.io.to(roomId).emit('holeUpdated', updatedHole);
            response.status(200).send();
        }
        catch (error) {
            logger_1.default.error("Error updating hole", error);
            response.status(error.statusCode).send(error.message);
        }
    }
    async deleteHole(request, response, next) {
        try {
            const roomId = response.locals.roomId;
            logger_1.default.info(`Deleting hole from room ${roomId}`);
            const holeId = request.body;
            const holeList = await this.holeDao.deleteHole(roomId, holeId);
            logger_1.default.info(`Successfully deleted hole ${holeId}`);
            response.status(200).json(holeList);
        }
        catch (error) {
            logger_1.default.error("Error deleting hole", error);
            response.status(error.statusCode).send(error.message);
        }
    }
};
HoleController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.HoleDao)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.SocketIO)),
    __metadata("design:paramtypes", [HoleDao_1.HoleDao, socket_io_1.Server])
], HoleController);
exports.HoleController = HoleController;
