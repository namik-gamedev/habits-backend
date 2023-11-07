import { Router } from 'express';
import authRouter from './authRouter/index.js';
import habitsRouter from './habitsRouter/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import userIdMiddleware from '../middlewares/userId.middleware.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/habits', authMiddleware, userIdMiddleware, habitsRouter);

export default router;
