import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { PlayerColorDTO } from "../models/dto/PlayerColorDTO";
import redisClient from '../redisClient';
import { CustomError } from '../util/error/CustomError';

@injectable()
export class PlayerColorController {

    async getPlayerColors(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving all player colors`);
            const cacheKey = 'player-colors';
            const cachedPlayerColors = await redisClient.get(cacheKey);
            if (cachedPlayerColors) {
                response.status(200).send(cachedPlayerColors);
                return;
            }
            const playerColors : Array<PlayerColorDTO> = PlayerColorDTO.createBaseColors();

            await redisClient.set(cacheKey, JSON.stringify(playerColors), {
                EX: 60
            });
            
            Logger.info("Number of colors retrieved successfully: " + playerColors.length);
            response.status(200).json(playerColors);
        } catch (error) {
            Logger.error("Error retrieving player colors");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }
}