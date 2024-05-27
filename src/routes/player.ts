import express from 'express';
import { PlayerController } from '../controllers/PlayerController';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';

const router = express.Router();
const playerController = container.get<PlayerController>(TYPES.PlayerController);

router.get('/', (req, res, next) => playerController.getPlayers(req, res, next));
router.get('/:playerId', (req, res, next) => playerController.getPlayerById(req, res, next));
router.post('/', (req, res, next) => playerController.addPlayer(req, res, next));
router.put('/:playerId', (req, res, next) => playerController.updatePlayer(req, res, next));
router.delete('/', (req, res, next) => playerController.deletePlayer(req, res, next));

export default router;