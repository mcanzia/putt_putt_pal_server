import express from 'express';
import { RoomController } from '../controllers/RoomController';

const router = express.Router();
const roomController : RoomController = new RoomController();

router.get('/', roomController.getRooms);
router.get('/:roomId', roomController.getRoomByNumber);
router.post('/create', roomController.createRoom);
router.post('/join', roomController.joinRoom);
router.post('/leave', roomController.leaveRoom);
router.delete('/', roomController.deleteRoom);

export default router;