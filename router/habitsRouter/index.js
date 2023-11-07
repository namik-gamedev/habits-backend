import { Router } from 'express';
import HabitController from '../../controllers/habit.controller.js';

const habitsRouter = Router();

const { getAllHabits, createHabit, deleteAllHabits, deleteHabit, getHabitInfo, updateHabitProgress, editHabit } = HabitController;

habitsRouter.get('/', getAllHabits);
habitsRouter.delete('/', deleteAllHabits);
habitsRouter.post('/', createHabit);
habitsRouter.delete('/:id', deleteHabit);
habitsRouter.get('/:id', getHabitInfo);
habitsRouter.post('/:id/update-progress', updateHabitProgress);
habitsRouter.patch('/:id/edit', editHabit);

export default habitsRouter;
