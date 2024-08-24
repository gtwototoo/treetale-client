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
	const { error, message } = (await res.json()) as { error: boolean; message: StorySchema };

	if (error) {
		redirect(302, '/');
	}

	return message;
};
