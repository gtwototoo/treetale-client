import type { ICoordinates, ISearched, IStoryEditableInfo, IVariable, TGenre } from '$lib/types';
import { fetchDelete, fetchGet, fetchPost, fetchPut } from '.';

import { goto } from '$app/navigation';
import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { IFrameCreate } from '$lib/types/editing';

export const addLike = async (storyId: number) => {
	interface IResponse {
		liked: boolean;
	}

	return await fetchPut<IResponse>(`${PUBLIC_TREETALE_API_URL}/story/${storyId}/like`);
};

export const updateInfomation = async (storyId: number, info: IStoryEditableInfo) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/story/${storyId}/edit/info`, info);
};

export const updateArea = async (
	storyId: number,
	frames: Array<IFrameCreate>,
	offset: ICoordinates,
	zoom: number
) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/story/${storyId}/edit/area`, {
		frames,
		offset,
		zoom
	});
};

export const updateVars = async (storyId: number, vars: Array<IVariable>) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/story/${storyId}/edit/vars`, {
		vars
	});
};

export const createStory = async () => {
	interface IResponse {
		storyId: number;
	}

	try {
		const response = await fetchPut<IResponse>(`${PUBLIC_TREETALE_API_URL}/story/create`);

		return goto(`/${response.storyId}/edit`);
	} catch (e) {
		console.error(e);
	}
};

export const reviewRequestStory = async (storyId: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/story/review/${storyId}`);
};

export const publishStory = async (storyId: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/story/publish/${storyId}`);
};

export const deleteStory = async (id: number) => {
	try {
		await fetchDelete(`${PUBLIC_TREETALE_API_URL}/story/${id}`);

		return goto(`/profile`, {
			invalidateAll: true
		});
	} catch (e) {
		console.error(e);
	}
};

export const searchStories = async (row: string, genres: Array<TGenre>) => {
	return await fetchGet<ISearched>(
		`${PUBLIC_TREETALE_API_URL}/story/search/?${new URLSearchParams({
			row,
			genres: genres.join(',')
		}).toString()}`
	);
};
