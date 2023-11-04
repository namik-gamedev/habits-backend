import { Router } from 'express';
import HabitController from '../../controllers/habit.controller.js';

const habitRouter = Router();

const { getAllHabits, createHabit, deleteAllHabits, deleteHabit, getHabitInfo, updateHabitProgress, editHabit } = HabitController;

habitRouter.get('/', getAllHabits);
habitRouter.delete('/', deleteAllHabits);
habitRouter.post('/', createHabit);
habitRouter.delete('/:id', deleteHabit);
habitRouter.get('/:id', getHabitInfo);
habitRouter.post('/:id/update-progress', updateHabitProgress);
habitRouter.patch('/:id/edit', editHabit);

export default habitRouter;
