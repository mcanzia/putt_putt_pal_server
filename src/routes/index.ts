import express from 'express';
import roomRoutes from './room';
import playerRoutes from './player';
import holeRoutes from './hole';
import playerColorRoutes from './playerColor';
import socketRoutes from './socket';
const router = express.Router();

router.use(express.json());

router.use('/room', roomRoutes);
router.use('/player', playerRoutes);
router.use('/hole', holeRoutes);
router.use('/playercolor', playerColorRoutes);
router.use('/socket', socketRoutes);

export default router;


