import { StoriesModel } from '$lib/server/models';
import { serialize } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.session;

	if (!user) throw redirect(302, '/');

	const stories = await StoriesModel.find({
		userId: user.userId
	}).select({
		_id: 0,
		grabbingScale: 0,
		grabbingOffsets: 0,
		frames: 0
	});

	return {
		stories: serialize(stories)
	};
};
