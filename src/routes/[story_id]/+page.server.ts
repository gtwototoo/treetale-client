import type { IFrame, IProgress, IUser } from '$lib/types/index.js';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { IStoryFull } from '$lib/types/reading.js';
import { randomError } from '$lib/utils';

interface IResponseProgress {
	author: IUser;
	frames: IFrame[];
	progress: IProgress[];
	story: IStoryFull;
}

export const load = async ({ params, fetch }) => {
	const storyId = +params.story_id;

	if (isNaN(storyId)) {
		throw randomError(404);
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`);
	const progressInfo = await res.json();

	return progressInfo as IResponseProgress;
};
