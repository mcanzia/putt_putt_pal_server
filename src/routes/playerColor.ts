import express from 'express';
import { PlayerColorController } from '../controllers/PlayerColorController';
import cache from 'express-redis-cache';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';

const router = express.Router();
const playerColorController = container.get<PlayerColorController>(TYPES.PlayerColorController);

const redisCache = cache();

router.get('/', redisCache.route({ expire: 60 }), (req, res, next) => playerColorController.getPlayerColors(req, res, next));

export default router;