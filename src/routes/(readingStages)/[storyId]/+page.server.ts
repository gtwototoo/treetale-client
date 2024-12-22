import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { FetchResponse, ResponseProgress } from '$lib/types/response.js';
import { randomError } from '$lib/utils/random';

export const load = async ({ fetch, params }) => {
	const storyId = +params.storyId;

	if (isNaN(storyId)) {
		randomError(404);
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`);
	const { error, message } = (await res.json()) as FetchResponse<ResponseProgress>;

	if (error) {
		randomError(404);
	}

	return message;
};
