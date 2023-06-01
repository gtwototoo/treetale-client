import { USER_WITHOUT_WORKSPACE } from '$lib/constants.js';
import { StoriesModel } from '$lib/server/models';
import { serialize } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.session;

	if (!user) throw redirect(302, '/');

	const stories = await StoriesModel.find({
		userId: user.userId
	})
		.select(USER_WITHOUT_WORKSPACE)
		.lean();

	return {
		stories: serialize(stories)
	};
};
