import { fetchDelete, fetchPost } from '.';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

interface IFileResponse {
	fileUrl: string;
}

type TAllowedFolders = 'avatars' | 'frames' | 'stories' | 'sounds';

export const removeImage = async (folder: TAllowedFolders, args?: Record<string, number>) => {
	return await fetchDelete<IFileResponse>(`${PUBLIC_TREETALE_API_URL}/files`, {
		type: 'image',
		folder,
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
		type: 'image',
		folder,
		...args
	}).toString();

	body.append('image', file);

	return await fetchPost<IFileResponse>(`${PUBLIC_TREETALE_API_URL}/files?${params}`, body);
};

export const saveSound = async (file: File, args?: Record<string, number>) => {
	const body = new FormData();
	const params = new URLSearchParams({
		type: 'sound',
		folder: 'frames',
		...args
	}).toString();

	body.append('sound', file);

	return await fetchPost<IFileResponse>(`${PUBLIC_TREETALE_API_URL}/files?${params}`, body);
};

export const removeSound = async (args: { storyId: number; frameId: number }) => {
	return await fetchDelete<IFileResponse>(`${PUBLIC_TREETALE_API_URL}/files`, {
		type: 'sound',
		folder: 'frames',
		...args
	});
};
