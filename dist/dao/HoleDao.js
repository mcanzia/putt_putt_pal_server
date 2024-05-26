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
exports.HoleDao = void 0;
const firebase_1 = require("../configs/firebase");
const CustomError_1 = require("../util/error/CustomError");
const redisClient_1 = __importDefault(require("../redisClient"));
const inversify_1 = require("inversify");
const types_1 = require("../configs/types");
const socket_io_1 = require("socket.io");
let HoleDao = class HoleDao {
    io;
    constructor(io) {
        this.io = io;
    }
    async getHoles(roomId) {
        try {
            const cacheKey = `holes:${roomId}`;
            const cachedHoles = await redisClient_1.default.get(cacheKey);
            if (cachedHoles) {
                return JSON.parse(cachedHoles);
            }
            let holes = new Map();
            const holesRef = firebase_1.db.ref(`rooms/${roomId}/holes`);
            const snapshot = await holesRef.once('value');
            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }
            holes = snapshot.val();
            await redisClient_1.default.set(cacheKey, JSON.stringify(holes), {
                EX: 60
            });
            return holes;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve holes from database: " + error);
        }
    }
    async getHoleById(roomId, holeId) {
        try {
            const cacheKey = `hole:${roomId}:${holeId}`;
            const cachedHole = await redisClient_1.default.get(cacheKey);
            if (cachedHole) {
                return JSON.parse(cachedHole);
            }
            const holeRef = firebase_1.db.ref(`rooms/${roomId}/holes/${holeId}`);
            const snapshot = await holeRef.once('value');
            if (!snapshot.exists()) {
                throw new Error('No such hole found in the specified room.');
            }
            const holeData = snapshot.val();
            const hole = { ...holeData };
            await redisClient_1.default.set(cacheKey, JSON.stringify(hole), {
                EX: 60
            });
            return hole;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve hole from database: " + error);
        }
    }
    async addHole(roomId, hole) {
        try {
            const holesRef = firebase_1.db.ref(`rooms/${roomId}/holes`);
            const newHolesRef = holesRef.push();
            hole.id = newHolesRef.key;
            await newHolesRef.set(hole);
            await redisClient_1.default.del(`holes:${roomId}`);
            const updatedHoles = await this.getHoles(roomId);
            return updatedHoles;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not add hole to database: " + error);
        }
    }
    async updateHole(roomId, holeId, updatedHole) {
        try {
            const holeRef = firebase_1.db.ref(`rooms/${roomId}/holes`);
            await holeRef.child(holeId).update(updatedHole);
            await redisClient_1.default.del(`hole:${roomId}:${holeId}`);
            await redisClient_1.default.del(`holes:${roomId}`);
            return updatedHole;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not update hole details: " + error);
        }
    }
    async deleteHole(roomId, holeId) {
        try {
            const holeRef = firebase_1.db.ref(`rooms/${roomId}/holes/${holeId}`);
            await holeRef.remove();
            await redisClient_1.default.del(`hole:${roomId}:${holeId}`);
            await redisClient_1.default.del(`holes:${roomId}`);
            const updatedHoles = await this.getHoles(roomId);
            return updatedHoles;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not delete hole from database: " + error);
        }
    }
};
HoleDao = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SocketIO)),
    __metadata("design:paramtypes", [socket_io_1.Server])
], HoleDao);
exports.HoleDao = HoleDao;
