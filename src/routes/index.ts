import express from 'express';
import roomRoutes from './room';
const router = express.Router();

router.use(express.json());

router.use('/room', roomRoutes);

export default router;


