import { Router } from 'express';
import authRouter from './authRouter/index.js';
import habitRouter from './habitRouter/index.js';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

const { getUsers } = UserController;

router.use('/auth', authRouter);
router.use('/habits', authMiddleware, habitRouter);
router.get('/users', authMiddleware, getUsers);

export default router;
