import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { FetchResponse, ResponseResults } from '$lib/types/response.js';
import { randomError } from '$lib/utils/random';

export const load = async ({ fetch, params }) => {
	const resultId = params.resultId;
	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/results/${resultId}`);
	const { error, message } = (await res.json()) as FetchResponse<ResponseResults>;

	if (error) {
		randomError(404);
	}

	return message;
};
