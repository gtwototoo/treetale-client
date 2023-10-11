import { DEFAULT_COLOR } from '$lib/constants';
import type { IStorySchema } from '$lib/types/schemas';
import mongoose from 'mongoose';

const storySchema = new mongoose.Schema<IStorySchema>(
	{
		storyId: Number,
		title: {
			type: String,
			default: ''
		},
		color: {
			type: [Number, Number, Number],
			default: DEFAULT_COLOR
		},
		imageId: {
			type: String,
			default: ''
		},
		version: {
			type: Number,
			default: 1
		},
		userId: {
			type: Number,
			required: true
		},
		draft: {
			type: Boolean,
			default: true
		},
		description: {
			type: String,
			default: ''
		},
		likes: Array,
		tags: Array,
		frames: Array,
		zoom: {
			type: Number,
			default: 100
		},
		vars: Array,
		offset: {
			type: Object,
			default: { x: 0, y: 0 }
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

export const StoriesModel =
	(mongoose.models.stories as mongoose.Model<IStorySchema>) ??
	mongoose.model<IStorySchema>('stories', storySchema);
