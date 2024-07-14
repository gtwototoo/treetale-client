import { PUBLIC_TREETALE_API_URL, PUBLIC_TREETALE_BOARD_URL } from '$env/static/public';

import type { Genre, Searched } from '$lib/types';

import { fetchGet, fetchPut } from '.';

export const addLike = async (storyId: number) => {
	interface IResponse {
		liked: boolean;
	}

	return await fetchPut<IResponse>(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/like`);
};

export const createStory = async () => {
	interface IResponse {
		storyId: number;
	}

	try {
		const { storyId } = await fetchPut<IResponse>(`${PUBLIC_TREETALE_API_URL}/stories/create`);

		window.location.href = `${PUBLIC_TREETALE_BOARD_URL}/${storyId}`;

		return;
	} catch (e) {
		console.error(e);
	}
};

export const searchStories = async (row: string, genres: Genre[]) => {
	const query = new URLSearchParams({
		genres: genres.join(','),
		row
	}).toString();

	return await fetchGet<Searched>(`${PUBLIC_TREETALE_API_URL}/stories/search?${query}`);
};
