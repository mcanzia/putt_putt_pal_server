import express from 'express';
import roomRoutes from './room';
import playerRoutes from './player';
const router = express.Router();

router.use(express.json());

router.use('/room', roomRoutes);
router.use('/player', playerRoutes);

export default router;


