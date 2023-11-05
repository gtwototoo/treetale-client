import mongoose from 'mongoose';

import type { IUser } from '$lib/types';

const userSchema = new mongoose.Schema<IUser>(
	{
		userId: {
			type: Number,
			required: true
		},
		sessionId: {
			type: String,
			default: null
		},
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		avatarId: {
			type: String,
			default: null
		},
		created: {
			type: Number,
			default: Date.now
		}
	},
	{
		versionKey: false
	}
);

export const UsersModel =
	(mongoose.models.users as mongoose.Model<IUser>) ?? mongoose.model<IUser>('users', userSchema);
