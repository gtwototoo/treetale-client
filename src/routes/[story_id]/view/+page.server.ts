import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { IStorySchema } from '$lib/types/schemas';
import { randomError } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

// пока тут функционал только для модераторов, дальше можно будет разбить логику и на режим просмотра
export const load = async ({ fetch, params, locals }) => {
	const user = locals.session;
	const storyId = +params.story_id;

	if (!user) throw redirect(302, '/signin');

	if (isNaN(storyId) || (user.role !== 'admin' && user.role !== 'moderator')) {
		throw randomError(404);
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}`);
	const storyInfo = await res.json();

	return storyInfo as IStorySchema;
};
