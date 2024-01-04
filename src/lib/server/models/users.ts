import { DEFAULT_COLOR } from '$lib/constants';
import type { IUser } from '$lib/types';
import mongoose from 'mongoose';

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
		imageUrl: {
			type: String,
			default: null
		},
		email: {
			type: String,
			required: true
		},
		name: {
			type: String,
			default: null
		},
		role: {
			type: String,
			default: 'member'
		},
		description: {
			type: String,
			default: null
		},
		color: {
			type: [
				{
					_id: false,
					type: Number,
					required: true
				}
			],
			default: DEFAULT_COLOR
		},
		subscriptions: {
			type: [
				{
					_id: false,
					type: Number,
					required: true
				}
			],
			default: []
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
