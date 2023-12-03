import type { IStoryFull } from '$lib/types/reading';
import { StoriesModel } from '$lib/server/models';
import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import { loadUsers } from '$lib/server/utils.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.session;

	if (!user) throw redirect(302, '/');

	const stories: Array<IStoryFull> = await StoriesModel.find({
		likes: {
			$in: [user.userId]
		}
	})
		.select(USER_WITHOUT_WORKSPACE)
		.lean();

	return {
		stories,
		authors: loadUsers(stories)
	};
};
