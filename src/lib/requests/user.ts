import { PUBLIC_TREESTORY_API_URL } from '$env/static/public';
import { fetchPost } from '.';

export const signInUser = async (value: string, token: string) => {
	return await fetchPost(`${PUBLIC_TREESTORY_API_URL}/sign-in`, {
		value,
		token,
	});
};

export const signUpUser = async (name: string, code: string) => {
	return await fetchPost(`${PUBLIC_TREESTORY_API_URL}/sign-up`, {
		name,
		code,
	});
};

export const signOutUser = async () => {
	return await fetchPost(`${PUBLIC_TREESTORY_API_URL}/sign-out`);
};

export const updateProfile = async (
	name: string,
	description: string,
	color: number[]
) => {
	return await fetchPost(`${PUBLIC_TREESTORY_API_URL}/user/update`, {
		name,
		description,
		color,
	});
};
