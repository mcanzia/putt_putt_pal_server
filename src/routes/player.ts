import express from 'express';
import { PlayerController } from '../controllers/PlayerController';

const router = express.Router();
const playerController : PlayerController = new PlayerController();

router.get('/', playerController.getPlayers);
router.get('/:playerId', playerController.getPlayerById);
router.post('/', playerController.addPlayer);
router.put('/:playerId', playerController.updatePlayer);
router.delete('/', playerController.deletePlayer);

export default router;