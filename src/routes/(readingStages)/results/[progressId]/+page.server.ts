import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { Frame, Story, User } from '$lib/types/index';
import type { FetchResponse } from '$lib/types/response.js';
import { randomError } from '$lib/utils/random';

export interface ResponseProgress {
	progressId: number;
	author: {
		subscribersCount: number;
	} & User;
	currentVersion: string;
	endFrame: Frame;
	choicesCount: number;
	progressVersion: string;
	story: Story;
	updated: number;
}

export const load = async ({ fetch, params }) => {
	const progressId = +params.progressId;

	if (isNaN(progressId)) {
		randomError(404);
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/results/${progressId}`);
	const { error, message } = (await res.json()) as FetchResponse<ResponseProgress>;

	if (error) {
		randomError(404);
	}

	return message;
};
