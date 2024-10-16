import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { Frame, ProgressChoices, Story, User } from '$lib/types/index';
import type { FetchResponse } from '$lib/types/response.js';

import { randomError } from '$lib/utils/random';

export interface ResponseProgress {
	progressId: number;
	author: {
		subscribersCount: number;
	} & User;
	currentVersion: string;
	frames: Frame[];
	choices: ProgressChoices[];
	progressVersion: string;
	story: Story;
	updated: number;
}

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
