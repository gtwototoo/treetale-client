import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import { StoriesModel } from '$lib/server/models';
import { serialize } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.session;

	if (!user) throw redirect(302, '/');

	const filter =
		user.role === 'admin' || user.role === 'moderator'
			? {
					$or: [{ userId: user.userId }, { status: 'review' }]
			  }
			: { userId: user.userId };

	const stories = await StoriesModel.find(filter)
		.select(USER_WITHOUT_WORKSPACE)
		.sort({
			created: 'desc'
		})
		.lean();

	return {
		stories: serialize(stories)
	};
};
