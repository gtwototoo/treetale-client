import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import { StoriesModel, UsersModel } from '$lib/server/models';
import type { IStoryFull } from '$lib/types/reading';
import { serialize } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.session;

	if (!user) throw redirect(302, '/');

	const rawStories: Array<IStoryFull> = await StoriesModel.find({
		likes: {
			$in: [user.userId]
		}
	})
		.select(USER_WITHOUT_WORKSPACE)
		.lean();

	const stories: Array<IStoryFull> = [];

	for (const story of rawStories) {
		if (story.userId === user.userId) {
			stories.push(story);
		} else {
			const author = await UsersModel.findOne({
				userId: +story.userId
			}).lean();

			stories.push({
				...story,
				author: author ? serialize(author) : null
			});
		}
	}

	return {
		stories
	};
};
