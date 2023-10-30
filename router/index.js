import { Router } from 'express';
import authRouter from './authRouter';
import UserController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

const { getUsers } = UserController;

router.use('/auth', authRouter);
router.get('/users', authMiddleware, getUsers);

export default router;
