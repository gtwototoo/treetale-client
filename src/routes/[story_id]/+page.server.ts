import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import { randomError } from '$lib/utils';

export const load = async ({ params, fetch }) => {
	const storyId = +params.story_id;

	if (isNaN(storyId)) {
		throw randomError(404);
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`);
	const progressInfo = await res.json();

	return progressInfo;
};
