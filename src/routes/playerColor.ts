import express from 'express';
import { PlayerColorController } from '../controllers/PlayerColorController';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';

const router = express.Router();
const playerColorController = container.get<PlayerColorController>(TYPES.PlayerColorController);

router.get('/', (req, res, next) => playerColorController.getPlayerColors(req, res, next));

export default router;