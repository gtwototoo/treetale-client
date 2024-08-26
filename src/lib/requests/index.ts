import type { NumericRange } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

import type { FetchResponse } from '$lib/types/response';

const fetchCore = async <T>(url: RequestInfo | URL, options?: RequestInit) => {
	const request = await fetch(url, {
		...options,
		credentials: 'include'
	});

	const response = (await request.json()) as FetchResponse<string>;

	if (!request.ok || response.error) {
		error(
			response.error ? 500 : (request.status as NumericRange<400, 599>),
			response.message && { message: response.message }
		);
	}

	return response as T;
};

export const fetchPost = <T = FetchResponse<string>>(
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

export const fetchGet = <T = FetchResponse<string>>(url: RequestInfo | URL) => {
	return fetchCore<T>(url);
};

export const fetchPut = <T = FetchResponse<string>>(url: RequestInfo | URL) => {
	const options: RequestInit = {
		method: 'PUT'
	};

	return fetchCore<T>(url, options);
};

export const fetchDelete = <T = FetchResponse<string>>(url: RequestInfo | URL, data?: unknown) => {
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
