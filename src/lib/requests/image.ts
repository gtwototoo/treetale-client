import { PUBLIC_TREESTORY_API_URL } from '$env/static/public';

export const removeImage = async (id: string, actions = '', storyId?: number, frameId?: number) => {
	const options: Record<string, number> = {};

	if (storyId) {
		options.storyId = storyId;
	}

	if (frameId) {
		options.frameId = frameId;
	}

	return fetch(`${PUBLIC_TREESTORY_API_URL}/images`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			id,
			actions,
			...options
		})
	});
};

export const saveImage = async (file: File, actions = '', args = '') => {
	const body = new FormData();

	body.append('image', file);

	return fetch(`${PUBLIC_TREESTORY_API_URL}/images?actions=${actions}${args}`, {
		method: 'POST',
		credentials: 'include',
		body
	});
};
