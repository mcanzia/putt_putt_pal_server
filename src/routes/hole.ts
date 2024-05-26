import express from 'express';
import { HoleController } from '../controllers/HoleController';
import cache from 'express-redis-cache';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';

const router = express.Router();
const holeController = container.get<HoleController>(TYPES.HoleController);

const redisCache = cache();

router.get('/', redisCache.route({ expire: 60 }), (req, res, next) => holeController.getHoles(req, res, next));
router.get('/:holeId', redisCache.route({ expire: 60 }), (req, res, next) => holeController.getHoleById(req, res, next));
router.post('/', (req, res, next) => holeController.addHole(req, res, next));
router.put('/:holeId', (req, res, next) => holeController.updateHole(req, res, next));
router.delete('/', (req, res, next) => holeController.deleteHole(req, res, next));

export default router;