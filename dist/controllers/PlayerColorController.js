"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerColorController = void 0;
const inversify_1 = require("inversify");
const logger_1 = __importDefault(require("../util/logs/logger"));
const PlayerColorDTO_1 = require("../models/dto/PlayerColorDTO");
const redisClient_1 = __importDefault(require("../redisClient"));
let PlayerColorController = class PlayerColorController {
    async getPlayerColors(request, response, next) {
        try {
            logger_1.default.info(`Retrieving all player colors`);
            const cacheKey = 'player-colors';
            const cachedPlayerColors = await redisClient_1.default.get(cacheKey);
            if (cachedPlayerColors) {
                response.status(200).send(cachedPlayerColors);
                return;
            }
            const playerColors = PlayerColorDTO_1.PlayerColorDTO.createBaseColors();
            await redisClient_1.default.set(cacheKey, JSON.stringify(playerColors), {
                EX: 60
            });
            logger_1.default.info("Number of colors retrieved successfully: " + playerColors.length);
            response.status(200).json(playerColors);
        }
        catch (error) {
            logger_1.default.error("Error retrieving player colors");
            response.status(error.statusCode).send(error.message);
        }
    }
};
PlayerColorController = __decorate([
    (0, inversify_1.injectable)()
], PlayerColorController);
exports.PlayerColorController = PlayerColorController;
