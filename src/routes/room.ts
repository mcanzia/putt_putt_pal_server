import express from 'express';
import { RoomController } from '../controllers/RoomController';
import cache from 'express-redis-cache';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';

const router = express.Router();
const roomController = container.get<RoomController>(TYPES.RoomController);

const redisCache = cache();

router.get('/', redisCache.route({ expire: 60 }), (req, res, next) => roomController.getRooms(req, res, next));
router.get('/:roomId', redisCache.route({ expire: 60 }), (req, res, next) => roomController.getRoomByNumber(req, res, next));
router.post('/create', (req, res, next) => roomController.createRoom(req, res, next));
router.post('/join', (req, res, next) => roomController.joinRoom(req, res, next));
router.post('/leave', (req, res, next) => roomController.leaveRoom(req, res, next));
router.put('/startGame/:roomId', (req, res, next) => roomController.startGame(req, res, next));
router.put('/:roomId', (req, res, next) => roomController.updateRoom(req, res, next));
router.delete('/', (req, res, next) => roomController.deleteRoom(req, res, next));

export default router;