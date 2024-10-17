import { PUBLIC_TREETALE_API_URL } from '$env/static/public';

import type { RGB } from '$lib/types';

import { fetchPost } from '.';

export const signInUser = async (value: string) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/signin`, {
		value
	});
};

export const signUpUser = async (name: string, code: string) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/signup`, {
		code,
		name
	});
};

export const signOutUser = async () => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/signout`);
};

export const updateProfile = async (
	linkName: string,
	name: string,
	description: string,
	color: RGB
) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/me/update`, {
		color,
		description,
		linkName,
		name
	});
};

export const subscribeProfile = async (userId: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/users/${userId}/subscribe`);
};

export const unsubscribeProfile = async (userId: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/users/${userId}/unsubscribe`);
};
