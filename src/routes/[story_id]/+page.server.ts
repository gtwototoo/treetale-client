import { ProgressModel, StoriesModel, UsersModel } from '$lib/server/models';
import { getChoiceFromId, getFrameFromId, randomError, serialize } from '$lib/utils';

import type { IFrame } from '$lib/types';
import type { IFrameCreate } from '$lib/types/editing';
import type { IStoryFull } from '$lib/types/reading';
import type { IStorySchema } from '$lib/types/schemas';
import { redirect } from '@sveltejs/kit';

interface IProgress {
	choiceId?: number;
	frameId: number;
}

const availableFrames = (progress: Array<IProgress>, frames: Array<IFrameCreate>) => {
	const available: Array<IFrame> = [];

	for (const stage of progress) {
		const frame = getFrameFromId(frames, stage.frameId);
		if (!frame) continue;

		const { frameId, text, choices, imageUrl } = frame;

		available.push({
			frameId,
			text,
			choices,
			imageUrl
		});
	}

	return available;
};

const formatedProgress = (choices: Array<number>, frames: Array<IFrameCreate>) => {
	const progress: Array<IProgress> = [
		{
			frameId: frames[0].frameId
		}
	];

	for (const key in choices) {
		progress[key].choiceId = choices[key];

		const { frameId, choiceId } = progress[key];
		const frame = getFrameFromId(frames, frameId);
		const choice = getChoiceFromId(frame, choiceId);

		if (!choice) break;

		progress.push({
			frameId: choice.frameId
		});
	}

	return progress;
};

const readingInfo = async (
	story: IStorySchema,
	choices: Array<number>
): Promise<{
	story: IStoryFull;
	frames: Array<IFrame>;
	progress: Array<IProgress>;
}> => {
	const { frames, ...info } = story;
	const progress: Array<IProgress> = formatedProgress(choices, frames);
	const author = await UsersModel.findOne({
		userId: +story.userId
	})
		.select({
			_id: 0,
			sessionId: 0
		})
		.lean();

	return {
		story: { ...info, author: author ? serialize(author) : null },
		frames: availableFrames(progress, frames),
		progress
	};
};

export const load = async ({ params, locals }) => {
	const storyId = +params.story_id;
	const user = locals.session;

	if (!user) throw redirect(302, '/signin');
	if (isNaN(storyId)) throw randomError(404);

	const story: IStorySchema | null = await StoriesModel.findOne({ storyId }).select({
		_id: 0,
		zoom: 0,
		offset: 0
	});

	if (!story) throw randomError(404);

	const progress = await ProgressModel.findOne({
		readerId: user.userId,
		storyId
	});

	return await readingInfo(serialize(story), progress?.choices || []);
};
