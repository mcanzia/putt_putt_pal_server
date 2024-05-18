import express from 'express';
import { HoleController } from '../controllers/HoleController';

const router = express.Router();
const holeController : HoleController = new HoleController();

router.get('/', holeController.getHoles);
router.get('/:holeId', holeController.getHoleById);
router.post('/', holeController.addHole);
router.put('/:holeId', holeController.updateHole);
router.delete('/', holeController.deleteHole);

export default router;