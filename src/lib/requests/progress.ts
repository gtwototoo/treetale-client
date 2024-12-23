import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { FetchResponse, ResponseProgress } from '$lib/types/response';

import { fetchDelete, fetchGet, fetchPost } from '.';

export const updateProgress = async (storyId: number, choiceId: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`, { choiceId });
};

export const deleteProgress = async (storyId: number) => {
	return await fetchDelete(`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`);
};

export const getProgress = async (storyId: number) => {
	return await fetchGet<FetchResponse<ResponseProgress>>(
		`${PUBLIC_TREETALE_API_URL}/progress/${storyId}`
	);
};
