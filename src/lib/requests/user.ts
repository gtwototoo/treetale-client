import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import { fetchPost } from '.';

export const signInUser = async (value: string) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/sign-in`, {
		value
	});
};

export const signUpUser = async (name: string, code: string) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/sign-up`, {
		name,
		code
	});
};

export const signOutUser = async () => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/sign-out`);
};

export const updateProfile = async (name: string, description: string, color: Array<number>) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/user/update`, {
		name,
		description,
		color
	});
};

export const subscribeProfile = async (id: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/user/subscribe/${id}`);
};

export const unsubscribeProfile = async (id: number) => {
	return await fetchPost(`${PUBLIC_TREETALE_API_URL}/user/unsubscribe/${id}`);
};
