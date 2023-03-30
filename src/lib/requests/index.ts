import { error } from '@sveltejs/kit';

export const fetchPost = async (url: RequestInfo | URL, data?: unknown, method = 'POST') => {
	const options: RequestInit = {};

	if (data) {
		options.headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		};

		options.body = JSON.stringify(data);
	}

	const request = await fetch(url, {
		...options,
		method,
		credentials: 'include'
	});

	const response = await request.json();

	return {
		error: request.ok ? null : error(request.status, response),
		response,
		status: request.status
	};
};
