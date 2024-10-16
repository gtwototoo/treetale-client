import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import { fetchGet, fetchPut } from '.';

import type { Searched, StoryFormat } from '$lib/types';
import type { FetchResponse } from '$lib/types/response';

export const addLike = async (storyId: number) => {
	type LikeResponse = FetchResponse<{ liked: boolean }>;

	return await fetchPut<LikeResponse>(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/like`);
};

export const createStory = async () => {
	type CreateStoryResponse = FetchResponse<{ storyId: number }>;

	return await fetchPut<CreateStoryResponse>(`${PUBLIC_TREETALE_API_URL}/stories/create`);
};

export const searchStories = async (row: string, genres: string[], format: StoryFormat | null) => {
	type SearchParams = {
		format?: StoryFormat;
		genres: string;
		row: string;
	};
	type SearchedResponse = FetchResponse<Searched>;

	const params: SearchParams = {
		genres: genres.join(','),
		row
	};

	if (format) {
		params.format = format;
	}

	const query = new URLSearchParams(params).toString();

	return await fetchGet<SearchedResponse>(`${PUBLIC_TREETALE_API_URL}/stories/search?${query}`);
};
