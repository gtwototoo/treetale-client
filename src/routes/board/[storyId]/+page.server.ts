import { redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { StorySchema } from '$lib/types/schemas';

export const load = async ({ fetch, locals, params }) => {
	const user = locals.session;
	const storyId = +params.storyId;

	if (!user || isNaN(storyId)) {
		redirect(302, '/');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}`);
	const { error, ...data } = (await res.json()) as { error: boolean } & StorySchema;

	if (error) {
		redirect(302, '/');
	}

	return data as StorySchema;
};
