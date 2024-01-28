import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { IFrame, IProgress, IUser } from '$lib/types/index.js';
import type { IStoryFull } from '$lib/types/reading.js';

import { randomError } from '$lib/utils';

interface IResponseProgress {
	author: IUser;
	frames: IFrame[];
	progress: IProgress[];
	story: IStoryFull;
}

export const load = async ({ fetch, params }) => {
	const storyId = +params.story_id;

	if (isNaN(storyId)) {
		randomError(404);
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`);
	const { error, ...data } = (await res.json()) as { error: boolean } & IResponseProgress;

	if (error) {
		randomError(404);
	}

	return data as IResponseProgress;
};
