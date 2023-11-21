import mongoose from 'mongoose';

import type { IProgressData } from '$lib/types';

const progressSchema = new mongoose.Schema<IProgressData>(
	{
		storyId: Number,
		version: Number,
		readerId: Number,
		choices: Array,
		started: {
			type: Number,
			default: Date.now
		}
	},
	{
		versionKey: false
	}
);

export const ProgressModel =
	(mongoose.models.progress as mongoose.Model<IProgressData>) ??
	mongoose.model<IProgressData>('progress', progressSchema);
