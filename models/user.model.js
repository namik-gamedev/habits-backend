import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	activated: {
		type: Boolean,
		default: false,
	},
	activationLink: {
		type: String,
	},
	expoPushToken: {
		type: String,
	},
});

const User = model('User', UserSchema);
export default User;
