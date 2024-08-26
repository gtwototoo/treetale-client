import { redirect } from '@sveltejs/kit';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { FetchResponse, ResponseStories } from '$lib/types/response';

import { randomError } from '$lib/utils/random.js';

export const load = async ({ fetch, locals }) => {
	const user = locals.session;

	if (!user) {
		redirect(302, '/');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/me/stories?type=liked`);
	const { error, message } = (await res.json()) as FetchResponse<ResponseStories>;

	if (error) {
		randomError(404);
	}

	return message;
};
