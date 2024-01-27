import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import { fetchDelete, fetchPost } from '.';

interface IFileResponse {
	fileUrl: string;
}

type TAllowedFolders = 'avatars' | 'frames' | 'sounds' | 'stories';

export const removeImage = async (folder: TAllowedFolders, args?: Record<string, number>) => {
	return await fetchDelete<IFileResponse>(`${PUBLIC_TREETALE_API_URL}/files`, {
		folder,
		type: 'image',
		...args
	});
};

export const saveImage = async (
	file: File,
	folder: TAllowedFolders,
	args?: Record<string, number>
) => {
	const body = new FormData();
	const params = new URLSearchParams({
		folder,
		type: 'image',
		...args
	}).toString();

	body.append('image', file);

	return await fetchPost<IFileResponse>(`${PUBLIC_TREETALE_API_URL}/files?${params}`, body);
};

export const saveSound = async (file: File, args?: Record<string, number>) => {
	const body = new FormData();
	const params = new URLSearchParams({
		folder: 'frames',
		type: 'sound',
		...args
	}).toString();

	body.append('sound', file);

	return await fetchPost<IFileResponse>(`${PUBLIC_TREETALE_API_URL}/files?${params}`, body);
};

export const removeSound = async (args: { frameId: number; storyId: number }) => {
	return await fetchDelete<IFileResponse>(`${PUBLIC_TREETALE_API_URL}/files`, {
		folder: 'frames',
		type: 'sound',
		...args
	});
};
