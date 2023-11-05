import { fetchPost } from '.';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

export const updateProgress = async (storyId: number, frameId: number, choiceId: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`, { choiceId });
};
