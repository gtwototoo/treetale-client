import { goto } from '$app/navigation';
import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { ICoordinates, ISearched, IStoryEditableInfo, IVariable, TGenre } from '$lib/types';
import type { IFrameCreate, INote } from '$lib/types/editing';

import { fetchDelete, fetchGet, fetchPost, fetchPut } from '.';

export const addLike = async (storyId: number) => {
	interface IResponse {
		liked: boolean;
	}

	return await fetchPut<IResponse>(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/like`);
};

export const updateInfomation = async (storyId: number, info: IStoryEditableInfo) => {
	return await fetchPost(
		`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/update?section=info`,
		info
	);
};

export const updateArea = async (
	storyId: number,
	frames: Array<IFrameCreate>,
	offset: ICoordinates,
	zoom: number
) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/update?section=area`, {
		frames,
		offset,
		zoom
	});
};

export const updateVars = async (storyId: number, vars: Array<IVariable>) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/update?section=vars`, {
		vars
	});
};

export const updateNotes = async (storyId: number, notes: Array<INote>) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/update?section=notes`, {
		notes
	});
};

export const createStory = async () => {
	interface IResponse {
		storyId: number;
	}

	try {
		const { storyId } = await fetchPut<IResponse>(`${PUBLIC_TREETALE_API_URL}/stories/create`);

		return goto(`/${storyId}/edit`);
	} catch (e) {
		console.error(e);
	}
};

export const reviewRequestStory = async (storyId: number) => {
	return await fetchPut(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/review`);
};

export const publishStory = async (storyId: number) => {
	return await fetchPut(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/publish`);
};

export const deleteStory = async (id: number) => {
	try {
		await fetchDelete(`${PUBLIC_TREETALE_API_URL}/stories/${id}`);

		return goto(`/profile`, {
			invalidateAll: true
		});
	} catch (e) {
		console.error(e);
	}
};

export const searchStories = async (row: string, genres: Array<TGenre>) => {
	const query = new URLSearchParams({
		genres: genres.join(','),
		row
	}).toString();

	return await fetchGet<ISearched>(`${PUBLIC_TREETALE_API_URL}/stories/search?${query}`);
};
