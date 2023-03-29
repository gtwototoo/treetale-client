import { goto } from '$app/navigation';
import { PUBLIC_TREESTORY_API_URL } from '$env/static/public';
import type { ICoordinates, IStoryEditableInfo, IVariable } from '$lib/types';
import type { IFrameCreate } from '$lib/types/editing';
import { fetchPost } from '.';

export const addLike = async (storyId: number) => {
	return await fetchPost(
		`${PUBLIC_TREESTORY_API_URL}/story/${storyId}/like`,
		undefined,
		'PUT'
	);
};

export const updateInfo = async (storyId: number, info: IStoryEditableInfo) => {
	return await fetchPost(
		`${PUBLIC_TREESTORY_API_URL}/story/${storyId}/edit?sections=information`,
		info
	);
};

export const updateFrames = async (
	storyId: number,
	frames: IFrameCreate[],
	grabbingOffsets: ICoordinates,
	grabbingScale: number
) => {
	return await fetchPost(
		`${PUBLIC_TREESTORY_API_URL}/story/${storyId}/edit?sections=area`,
		{
			frames,
			grabbingOffsets,
			grabbingScale,
		}
	);
};

export const updateVars = async (storyId: number, vars: IVariable[]) => {
	return await fetchPost(
		`${PUBLIC_TREESTORY_API_URL}/story/${storyId}/edit?sections=vars`,
		{
			vars,
		}
	);
};

export const searchStories = async (row: string) => {
	const request = await fetch(`/api/story/search?row=${row}`);
	const response = await request.json();

	return {
		error: !request.ok,
		response,
	};
};

export const createStory = async () => {
	let request: Response | undefined = undefined;

	try {
		request = await fetch(`${PUBLIC_TREESTORY_API_URL}/story/create`, {
			method: 'PUT',
			credentials: 'include',
		});
	} catch (e) {
		console.error(e);
	}

	if (request) {
		const response = (await request.json()) as {
			error: boolean;
			storyId?: number;
		};

		if (!response.error) {
			await goto(`/${response.storyId}/edit`);
		}
	}
};

export const deleteStory = async (id: number) => {
	await fetch(`${PUBLIC_TREESTORY_API_URL}/story/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	});

	return goto(`/profile`);
};
