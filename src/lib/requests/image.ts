import { fetchDelete, fetchPost } from '.';

import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

interface IResponse {
	imageUrl: string;
}

type TAllowedFolders = 'avatars' | 'frames' | 'stories';

export const removeImage = async (folder: TAllowedFolders, args?: Record<string, number>) => {
	return await fetchDelete<IResponse>(`${PUBLIC_TREETALE_API_URL}/images`, {
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
		folder,
		...args
	}).toString();

	body.append('image', file);

	return await fetchPost<IResponse>(`${PUBLIC_TREETALE_API_URL}/images?${params}`, body);
};
