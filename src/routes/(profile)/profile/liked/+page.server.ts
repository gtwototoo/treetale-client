import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import { StoriesModel } from '$lib/server/models';
import { loadUsers } from '$lib/server/utils.js';
import type { IStoryFull } from '$lib/types/reading';
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
		authors: await loadUsers(stories)
	};
};
