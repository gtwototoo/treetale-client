import { serialize } from '$lib/helpers';
import { StoriesModel, UsersModel } from '$lib/server/models';
import type { IStoryFull } from '$lib/types/reading';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.session;

	if (!user) throw redirect(302, '/');

	const rawStories: IStoryFull[] = await StoriesModel.find({
		likes: {
			$in: [user.userId],
		},
	})
		.select({
			_id: 0,
			grabbingScale: 0,
			grabbingOffsets: 0,
			frames: 0,
		})
		.lean();

	const stories: IStoryFull[] = [];

	for (const story of rawStories) {
		if (story.userId === user.userId) {
			stories.push(story);
		} else {
			const author = serialize(
				await UsersModel.findOne({
					userId: +story.userId,
				})
			);
			stories.push({
				...story,
				author: author ? author : null,
			});
		}
	}

	return {
		stories,
	};
};
