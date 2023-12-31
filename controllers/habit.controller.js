import HabitService from '../services/habit.service.js';

export default class HabitController {
	static async getAllHabits(req, res, next) {
		try {
			const { userId } = req;

			const habits = await HabitService.getAllHabits(userId);
			res.json(habits);
		} catch (e) {
			next(e);
		}
	}
	static async createHabit(req, res, next) {
		try {
			const { userId } = req;

			await HabitService.createHabit({ ...req.body, userId });
			res.redirect(`${process.env.API_URL}/api/habits`);
		} catch (e) {
			next(e);
		}
	}
	static async deleteHabit(req, res, next) {
		try {
			const { id } = req.params;
			await HabitService.deleteHabit(id);
			res.redirect(`${process.env.API_URL}/api/habits`);
		} catch (e) {
			next(e);
		}
	}
	static async deleteAllHabits(_req, res, next) {
		try {
			await HabitService.deleteAllHabits();
			res.json([]);
		} catch (e) {
			next(e);
		}
	}
	static async getHabitInfo(req, res, next) {
		try {
			const { id } = req.params;
			const habit = await HabitService.getHabitInfo(id);
			res.json(habit);
		} catch (e) {
			next(e);
		}
	}
	static async updateHabitProgress(req, res, next) {
		try {
			const { id } = req.params;
			const { date, progress } = req.body;
			await HabitService.updateHabitProgress(id, date, progress);
			res.redirect(`${process.env.API_URL}/api/habits`);
		} catch (e) {
			next(e);
		}
	}
	static async editHabit(req, res, next) {
		try {
			const { id } = req.params;
			await HabitService.editHabit(id, req.body);
			res.redirect(`${process.env.API_URL}/api/habits`);
		} catch (e) {
			next(e);
		}
	}
}
