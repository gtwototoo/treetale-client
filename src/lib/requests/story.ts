import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { Searched } from '$lib/types';
import type { FetchResponse } from '$lib/types/response';

import { fetchGet, fetchPut } from '.';

export const addLike = async (storyId: number) => {
	type LikeResponse = FetchResponse<{ liked: boolean }>;

	return await fetchPut<LikeResponse>(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/like`);
};

export const createStory = async () => {
	type CreateStoryResponse = FetchResponse<{ storyId: number }>;

	return await fetchPut<CreateStoryResponse>(`${PUBLIC_TREETALE_API_URL}/stories/create`);
};

export const searchStories = async (row: string, genres: string[]) => {
	type SearchedResponse = FetchResponse<Searched>;

	const query = new URLSearchParams({
		genres: genres.join(','),
		row
	}).toString();

	return await fetchGet<SearchedResponse>(`${PUBLIC_TREETALE_API_URL}/stories/search?${query}`);
};
