import moment from 'moment';
import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

const HabitSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	history: [
		{
			_id: false,
			date: {
				type: Number, // date in ms for formatting by momentjs
				required: true,
			},
			progress: {
				type: Number, // number from 0 to goal, represents habit progress
				default: 0,
			},
			streak: {
				type: Number,
				default: 0,
			},
		},
	],
	schedule: [Number],
	goal: {
		type: Number,
		required: true,
	},
	longestStreak: {
		type: Number,
		default: 0,
	},
	totalDoneDays: {
		type: Number,
		default: 0,
	},
});

const Habit = model('Habit', HabitSchema);
export default Habit;
