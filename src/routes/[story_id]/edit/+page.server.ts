import { randomError, serialize } from '$lib/utils';

import { StoriesModel } from '$lib/server/models';
import type { IStorySchema } from '$lib/types/schemas';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const user = locals.session;
	const storyId = +params.story_id;

	if (isNaN(storyId)) {
		throw randomError(404);
	}

	if (!user) throw redirect(302, '/signin');

	const story: IStorySchema | null = await StoriesModel.findOne({
		storyId,
		userId: user.userId
	});

	if (!story) throw randomError(404);

	const { frames, ...info } = serialize(story);

	return {
		frames,
		info
	};
};
