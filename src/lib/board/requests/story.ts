import { goto } from '$app/navigation';
import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { Coordinates, Frame, Note, StoryEditableInfo, Variable } from '$lib/types';
import type { FetchResponse } from '$lib/types/response';

import { fetchDelete, fetchPost, fetchPut } from '$lib/requests';

export const updateInfomation = async (storyId: number, info: StoryEditableInfo) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/update/info`, info);
};

export const updateArea = async (
	storyId: number,
	frames: Frame[],
	offset: Coordinates,
	zoom: number
) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/update/area`, {
		frames,
		offset,
		zoom
	});
};

export const updateVars = async (storyId: number, vars: Variable[]) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/update/vars`, {
		vars
	});
};

export const updateNotes = async (storyId: number, notes: Note[]) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/update/notes`, {
		notes
	});
};

export const reviewRequestStory = async (storyId: number) => {
	return await fetchPut(`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/review`);
};

export const publishStory = async (storyId: number) => {
	return await fetchPut<FetchResponse<{ version: string }>>(
		`${PUBLIC_TREETALE_API_URL}/stories/${storyId}/publish`
	);
};

export const deleteStory = async (id: number) => {
	try {
		await fetchDelete(`${PUBLIC_TREETALE_API_URL}/stories/${id}`);

		return goto(`/profile`, {
			invalidateAll: true
		});
	} catch (error) {
		console.error(error);
	}
};
