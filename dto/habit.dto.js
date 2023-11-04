export default class HabitDto {
	id;
	name;
	history;
	schedule;
	goal;
	totalDoneDays;
	longestStreak;
	constructor(model) {
		this.id = model._id;
		this.name = model.name;
		this.history = model.history;
		this.schedule = model.schedule;
		this.goal = model.goal;
		this.totalDoneDays = model.totalDoneDays;
		this.longestStreak = model.longestStreak;
	}
}
