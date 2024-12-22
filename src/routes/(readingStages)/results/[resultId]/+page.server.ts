import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { Story, User } from '$lib/types/index';
import type { FetchResponse } from '$lib/types/response.js';
import type { ProgressSchema } from '$lib/types/schemas.js';
import { randomError } from '$lib/utils/random';

export interface ResponseProgress {
	resultId: number;
	author: {
		subscribersCount: number;
	} & User;
	progress: Pick<ProgressSchema, 'endFrame' | 'version' | 'updated'> & { choicesCount: number };
	archived: boolean;
	story: Story;
}

export const load = async ({ fetch, params }) => {
	const resultId = params.resultId;
	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/results/${resultId}`);
	const { error, message } = (await res.json()) as FetchResponse<ResponseProgress>;

	if (error) {
		randomError(404);
	}

	return message;
};
