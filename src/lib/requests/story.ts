import { goto } from '$app/navigation';
import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { Searched } from '$lib/types';

import { fetchGet, fetchPut } from '.';

export const addLike = async (storyId: number) => {
	interface Response {
		liked: boolean;
	}

	return await fetchPut<Response>(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/like`);
};

export const createStory = async () => {
	interface Response {
		storyId: number;
	}

	try {
		const { storyId } = await fetchPut<Response>(`${PUBLIC_TREETALE_API_URL}/stories/create`);

		return goto(`/board/${storyId}`);
	} catch (e) {
		console.error(e);
	}
};

export const searchStories = async (row: string, genres: string[]) => {
	const query = new URLSearchParams({
		genres: genres.join(','),
		row
	}).toString();

	return await fetchGet<Searched>(`${PUBLIC_TREETALE_API_URL}/stories/search?${query}`);
};
