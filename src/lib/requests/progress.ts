import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import { fetchDelete, fetchPost } from '.';

export const updateProgress = async (storyId: number, choiceId: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`, { choiceId });
};

export const deleteProgress = async (storyId: number) => {
	return await fetchDelete(`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`);
};
