import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { FetchResponse } from '$lib/types/response';

import { fetchDelete, fetchPost } from '$lib/requests';

interface FileResponse {
	fileUrl: string;
}

type AllowedFolders = 'avatars' | 'frames' | 'sounds' | 'stories';

export const removeImage = async (folder: AllowedFolders, args?: Record<string, number>) => {
	return await fetchDelete<FetchResponse<FileResponse>>(`${PUBLIC_TREETALE_API_URL}/files`, {
		folder,
		type: 'image',
		...args
	});
};

export const saveImage = async (
	file: File,
	folder: AllowedFolders,
	args?: Record<string, number>
) => {
	const body = new FormData();
	const params = new URLSearchParams({
		folder,
		type: 'image',
		...args
	}).toString();

	body.append('image', file);

	return await fetchPost<FetchResponse<FileResponse>>(
		`${PUBLIC_TREETALE_API_URL}/files?${params}`,
		body
	);
};

export const saveSound = async (file: File, args?: Record<string, number>) => {
	const body = new FormData();
	const params = new URLSearchParams({
		folder: 'frames',
		type: 'sound',
		...args
	}).toString();

	body.append('sound', file);

	return await fetchPost<FetchResponse<FileResponse>>(
		`${PUBLIC_TREETALE_API_URL}/files?${params}`,
		body
	);
};

export const removeSound = async (args: { frameId: number; storyId: number }) => {
	return await fetchDelete<FetchResponse<FileResponse>>(`${PUBLIC_TREETALE_API_URL}/files`, {
		folder: 'frames',
		type: 'sound',
		...args
	});
};
