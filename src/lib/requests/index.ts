import { PUBLIC_TREESTORY_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const fetchPost = async (
	url: RequestInfo | URL,
	data?: unknown,
	method = 'POST'
) => {
	const options: RequestInit = {};

	if (data) {
		options.headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		};

		options.body = JSON.stringify(data);
	}

	const request = await fetch(url, {
		...options,
		method,
		credentials: 'include',
	});

	const response = await request.json();

	return {
		error: request.ok ? null : error(request.status, response),
		response,
		status: request.status,
	};
};

export const removeImage = async (
	id: string,
	actions = '',
	storyId?: number,
	frameId?: number
) => {
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
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({
			id,
			actions,
			...options,
		}),
	});
};

export const saveImage = async (file: File, actions = '', args = '') => {
	const body = new FormData();

	body.append('image', file);

	return fetch(
		`${PUBLIC_TREESTORY_API_URL}/images?actions=${actions}${args}`,
		{
			method: 'POST',
			credentials: 'include',
			body,
		}
	);
};
