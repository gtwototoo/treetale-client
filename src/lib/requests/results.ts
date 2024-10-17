import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { FetchResponse } from '$lib/types/response';

import { fetchPost } from '.';

export const setEndProgress = async (progressId: number) => {
	type EndedResponse = FetchResponse<{ resultId: number }>;

	return await fetchPost<EndedResponse>(`${PUBLIC_TREETALE_API_URL}/results/${progressId}/end`);
};
