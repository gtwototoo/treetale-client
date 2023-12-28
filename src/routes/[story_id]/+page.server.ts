import { ProgressModel, StoriesModel, UsersModel } from '$lib/server/models';
import type { IFrame, IProgress, IProgressData } from '$lib/types';
import { getFrameFromId, randomError, serialize } from '$lib/utils';

import type { IFrameCreate } from '$lib/types/editing';
import type { IStoryFull } from '$lib/types/reading';
import type { IStorySchema } from '$lib/types/schemas';

const availableFrames = (frames: Array<IFrameCreate>, progressStages: Array<IProgress>) => {
	const frame = getFrameFromId(frames, frames[0].frameId);
	const { frameId, text, choices, imageUrl } = frame;
	const available: Array<IFrame> = [{ frameId, text, choices, imageUrl }];

	for (const stage of progressStages) {
		const frame = getFrameFromId(frames, stage.nextFrameId);

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

const readingInfo = async (
	story: IStorySchema,
	progressStages: Array<IProgress>
): Promise<{
	story: IStoryFull;
	frames: Array<IFrame>;
	progress: Array<IProgress>;
}> => {
	const { frames, ...info } = story;

	const author = await UsersModel.findOne({
		userId: story.userId
	})
		.select({
			_id: 0,
			sessionId: 0
		})
		.lean();

	return {
		story: { ...info, author: serialize(author) },
		frames: availableFrames(frames, progressStages),
		progress: progressStages
	};
};

export const load = async ({ params, locals }) => {
	const storyId = +params.story_id;
	const user = locals.session;

	if (isNaN(storyId)) throw randomError(404);

	const story: IStorySchema | null = await StoriesModel.findOne({
		storyId,
		status: 'published'
	}).select({
		_id: 0,
		zoom: 0,
		offset: 0
	});

	if (!story) throw randomError(404);

	let progress: IProgressData;

	if (user) {
		progress = await ProgressModel.findOne({
			readerId: user.userId,
			storyId
		})
			.select({
				_id: 0
			})
			.lean();
	}

	return await readingInfo(serialize(story), progress?.choices || []);
};
