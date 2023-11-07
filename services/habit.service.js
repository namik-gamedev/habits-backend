import moment from 'moment';
import HabitDto from '../dto/habit.dto.js';
import ApiError from '../exceptions/apiError.js';
import { HABIT_DAY_NOT_FOUND, HABIT_NOT_FOUND } from '../exceptions/errorCodes.js';
import Habit from '../models/habit.model.js';

export default class HabitService {
	static async getAllHabits(userId) {
		const today = moment();
		const date = today.startOf('day');
		const weekday = today.isoWeekday() - 1;
		await Habit.updateMany(
			{
				$or: [
					{
						history: {
							$elemMatch: {
								date: { $lte: date },
							},
						},
					},
					{ history: { $size: 0 } },
				],
				schedule: {
					$in: [weekday],
				},
			},
			{
				$push: {
					history: {
						date,
					},
				},
			},
		);

		const habits = await Habit.find({ userId });
		const habitsDto = habits.map(habit => new HabitDto(habit));
		return habitsDto;
	}
	static async createHabit(values) {
		const habit = await Habit.create(values);
		return habit;
	}
	static async deleteHabit(id) {
		const habit = await Habit.findByIdAndDelete(id);
		if (!habit) {
			throw ApiError.NotFound(HABIT_NOT_FOUND);
		}
		return habit;
	}
	static async deleteAllHabits() {
		await Habit.deleteMany({});
	}
	static async getHabitInfo(id) {
		const habit = await Habit.findById(id);
		if (!habit) {
			throw ApiError.NotFound(HABIT_NOT_FOUND);
		}
		const habitDto = new HabitDto(habit);
		return habitDto;
	}
	static async updateHabitProgress(id, date, progress) {
		const habit = await Habit.findById(id);
		if (!habit) {
			throw ApiError.NotFound(HABIT_NOT_FOUND);
		}
		const dayIndex = habit.history.findIndex(day => day.date === date);
		if (dayIndex !== -1) {
			const day = habit.history[dayIndex];
			day.progress = progress;
			const isDone = day.progress >= habit.goal;
			if (isDone) {
				const prevDay = habit.history[dayIndex - 1];
				const isPreviousDone = prevDay?.progress >= habit.goal;
				if (isPreviousDone) {
					day.streak = prevDay.streak + 1;
				} else {
					day.streak = 1;
				}
			} else {
				day.streak = 0;
			}
		} else {
			throw ApiError.NotFound(HABIT_DAY_NOT_FOUND);
			// habit.history.push({
			// 	date,
			// 	progress,
			// });
		}

		const totalDoneDays = habit.history.reduce((total, day) => (day.progress >= habit.goal ? total + 1 : total), 0);
		habit.totalDoneDays = totalDoneDays;

		const streaks = habit.history.map(day => day.streak);
		const longestStreak = Math.max(...streaks);
		habit.longestStreak = longestStreak;

		habit.history.sort((a, b) => a.date - b.date);

		await habit.save();

		return habit;
	}
	static async editHabit(id, values) {
		const habit = await Habit.findByIdAndUpdate(id, values);
		if (!habit) {
			throw ApiError.NotFound(HABIT_NOT_FOUND);
		}
		return habit;
	}
}
