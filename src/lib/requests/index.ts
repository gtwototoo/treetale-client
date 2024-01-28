import { error } from '@sveltejs/kit';

interface DefaultResponse {
	message: string;
}

const fetchCore = async <T>(url: RequestInfo | URL, options?: RequestInit) => {
	const request = await fetch(url, {
		...options,
		credentials: 'include'
	});

	const response = (await request.json()) as DefaultResponse;

	if (!request.ok) {
		error(request.status, response.message && { message: response.message });
	}

	return response as T;
};

export const fetchPost = <T = DefaultResponse>(
	url: RequestInfo | URL,
	data?: FormData | unknown
) => {
	const options: RequestInit = {
		method: 'POST'
	};

	if (data) {
		if (data instanceof FormData) {
			options.body = data;
		} else {
			options.headers = {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			};

			options.body = JSON.stringify(data);
		}
	}

	return fetchCore<T>(url, options);
};

export const fetchGet = <T = DefaultResponse>(url: RequestInfo | URL) => {
	return fetchCore<T>(url);
};

export const fetchPut = <T = DefaultResponse>(url: RequestInfo | URL) => {
	const options: RequestInit = {
		method: 'PUT'
	};

	return fetchCore<T>(url, options);
};

export const fetchDelete = <T = DefaultResponse>(url: RequestInfo | URL, data?: unknown) => {
	const options: RequestInit = {
		method: 'DELETE'
	};

	if (data) {
		options.headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		};

		options.body = JSON.stringify(data);
	}

	return fetchCore<T>(url, options);
};
