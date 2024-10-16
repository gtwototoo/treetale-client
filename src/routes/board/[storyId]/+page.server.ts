import { PUBLIC_TEST_STORY_ID, PUBLIC_TREETALE_API_URL } from '$env/static/public';

import { redirect } from '@sveltejs/kit';

import type { FetchResponse } from '$lib/types/response';
import type { StorySchema } from '$lib/types/schemas';

export const load = async ({ fetch, locals, params }) => {
	const user = locals.session;
	const storyId = +params.storyId;

	if (PUBLIC_TEST_STORY_ID !== params.storyId && (!user || isNaN(storyId))) {
		redirect(302, '/');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}`);
	const { error, message } = (await res.json()) as FetchResponse<{ story: StorySchema }>;

	if (error) {
		redirect(302, '/');
	}

	return message.story;
};
