import { redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { IStorySchema } from '$lib/types/schemas';

import { randomError } from '$lib/utils';

export const load = async ({ fetch, locals, params }) => {
	const user = locals.session;
	const storyId = +params.story_id;

	if (!user) redirect(302, '/signin');

	if (isNaN(storyId)) {
		randomError(404);
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}`);
	const { error, ...data } = (await res.json()) as { error: boolean } & IStorySchema;

	if (error) {
		randomError(404);
	}

	return data as IStorySchema;
};
