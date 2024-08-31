import express from 'express';
import { SocketController } from '../controllers/SocketController';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';

const router = express.Router();
const socketController = container.get<SocketController>(TYPES.SocketController);

router.post('/checkConnection', (req, res, next) => socketController.checkSocketConnection(req, res, next));

export default router;