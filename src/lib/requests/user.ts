import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import { fetchPost } from '.';

export const signInUser = async (value: string) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/sign-in`, {
		value
	});
};

export const signUpUser = async (name: string, code: string) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/sign-up`, {
		code,
		name
	});
};

export const signOutUser = async () => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/sign-out`);
};

export const updateProfile = async (name: string, description: string, color: Array<number>) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/me/update`, {
		color,
		description,
		name
	});
};

export const subscribeProfile = async (userId: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/users/${userId}/subscribe`);
};

export const unsubscribeProfile = async (userId: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/users/${userId}/unsubscribe`);
};
