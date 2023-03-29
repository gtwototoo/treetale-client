import { notFoundVariants } from '$lib/constants';
import { ProgressModel, StoriesModel, UsersModel } from '$lib/server/models';
import type { IFrame } from '$lib/types';
import type { IFrameCreate } from '$lib/types/editing';
import type { IStoryFull } from '$lib/types/reading';
import type { IStorySchema } from '$lib/types/schemas';
import { getFrameFromId, randomArray, serialize } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface IProgress {
	frameId: number;
	choiceId?: number;
}

const availableFrames = (progress: IProgress[], frames: IFrameCreate[]) => {
	const available: IFrame[] = [];

	for (const stage of progress) {
		const frame = frames.find(({ frameId }) => frameId === stage.frameId);

		if (!frame) continue;

		const { frameId, text, choices, imageId } = frame;

		available.push({
			frameId,
			text,
			choices,
			imageId
		});
	}

	return available;
};

const formatedProgress = (choices: number[], frames: IFrameCreate[]) => {
	const progress: IProgress[] = [
		{
			frameId: frames[0].frameId
		}
	];

	for (const key in choices) {
		progress[key].choiceId = choices[key];

		const { frameId, choiceId } = progress[key];
		const data = getFrameFromId(frames, frameId, choiceId);

		if (!data?.choice) break;

		progress.push({
			frameId: data.choice.frameId
		});
	}

	return progress;
};

const readingInfo = async (
	story: IStorySchema,
	choices: number[]
): Promise<{
	story: IStoryFull;
	frames: IFrame[];
	progress: IProgress[];
}> => {
	const { frames, ...info } = story;
	const progress: IProgress[] = formatedProgress(choices, frames);
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

export const load: PageServerLoad = async ({ params, locals }) => {
	const storyId = +params.story_id;

	if (isNaN(storyId)) throw error(404, randomArray(notFoundVariants));

	const story: IStorySchema | null = await StoriesModel.findOne({ storyId })
		.select({
			_id: 0,
			grabbingScale: 0,
			grabbingOffsets: 0
		})
		.lean();

	if (!story) throw error(404, randomArray(notFoundVariants));

	if (!locals.session) return await readingInfo(story, []);

	const readerId = locals.session.userId;

	const progress = await ProgressModel.findOne({
		storyId,
		readerId
	});

	if (!progress) return await readingInfo(story, []);

	return await readingInfo(story, progress.choices);
};
