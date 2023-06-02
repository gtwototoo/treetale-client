import { PUBLIC_TREESTORY_API_URL } from '$env/static/public';
import { fetchDelete, fetchPost } from '.';

interface IResponse {
	imageId: string;
}

export const removeImage = async (id: string, actions = '', storyId?: number, frameId?: number) => {
	const body: Record<string, number> = {};

	return await fetchDelete<IResponse>(`${PUBLIC_TREESTORY_API_URL}/images`, {
		id,
		actions,
		storyId,
		frameId,
		...body
	});
};

export const saveImage = async (file: File, actions = '', args = '') => {
	const body = new FormData();

	body.append('image', file);

	return await fetchPost<IResponse>(
		`${PUBLIC_TREESTORY_API_URL}/images?actions=${actions}${args}`,
		body
	);
};
