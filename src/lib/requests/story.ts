import { goto } from '$app/navigation';
import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import type { ICoordinates, IStoryEditableInfo, IVariable } from '$lib/types';
import type { IFrameCreate } from '$lib/types/editing';
import { fetchDelete, fetchGet, fetchPost, fetchPut } from '.';

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
	frames: IFrameCreate[],
	offset: ICoordinates,
	zoom: number
) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/story/${storyId}/edit?sections=area`, {
		frames,
		offset,
		zoom
	});
};

export const updateVars = async (storyId: number, vars: IVariable[]) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/story/${storyId}/edit?sections=vars`, {
		vars
	});
};

export const searchStories = async (row: string) => {
	return await fetchGet(`/api/story/search?row=${row}`);
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
