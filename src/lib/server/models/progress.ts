import type { IProgressData } from '$lib/types';
import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema<IProgressData>(
	{
		storyId: Number,
		version: Number,
		readerId: String,
		choices: Array,
		started: {
			type: Number,
			default: Date.now,
		},
	},
	{
		versionKey: false,
	}
);

export const ProgressModel =
	(mongoose.models.progress as mongoose.Model<IProgressData>) ??
	mongoose.model<IProgressData>('progress', progressSchema);
