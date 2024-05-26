import express from 'express';
import { PlayerController } from '../controllers/PlayerController';
import cache from 'express-redis-cache';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';

const router = express.Router();
const playerController = container.get<PlayerController>(TYPES.PlayerController);

const redisCache = cache();

router.get('/', redisCache.route({ expire: 60 }), (req, res, next) => playerController.getPlayers(req, res, next));
router.get('/:playerId', redisCache.route({ expire: 60 }), (req, res, next) => playerController.getPlayerById(req, res, next));
router.post('/', (req, res, next) => playerController.addPlayer(req, res, next));
router.put('/:playerId', (req, res, next) => playerController.updatePlayer(req, res, next));
router.delete('/', (req, res, next) => playerController.deletePlayer(req, res, next));

export default router;