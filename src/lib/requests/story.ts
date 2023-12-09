import type { ICoordinates, IStoryEditableInfo, IUser, IVariable } from '$lib/types';
import { fetchDelete, fetchGet, fetchPost, fetchPut } from '.';

import { goto } from '$app/navigation';
import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { IFrameCreate } from '$lib/types/editing';
import type { IStorySchema } from '$lib/types/schemas';

export const addLike = async (storyId: number) => {
	interface IResponse {
		liked: boolean;
	}

	return await fetchPut<IResponse>(`${PUBLIC_TREETALE_API_URL}/story/${storyId}/like`);
};

export const updateInfomation = async (storyId: number, info: IStoryEditableInfo) => {
	return await fetchPost(
		`${PUBLIC_TREETALE_API_URL}/story/${storyId}/edit?sections=information`,
		info
	);
};

export const updateArea = async (
	storyId: number,
	frames: Array<IFrameCreate>,
	offset: ICoordinates,
	zoom: number
) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/story/${storyId}/edit?sections=area`, {
		frames,
		offset,
		zoom
	});
};

export const updateVars = async (storyId: number, vars: Array<IVariable>) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/story/${storyId}/edit?sections=vars`, {
		vars
	});
};

export const searchStories = async (row: string) => {
	interface ISearched {
		authors: Array<IUser>;
		stories: Array<IStorySchema>;
	}

	return await fetchGet<ISearched>(`${PUBLIC_TREETALE_API_URL}/story/search?row=${row}`);
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
