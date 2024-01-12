import { PUBLIC_TREETALE_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params, fetch }) => {
	const { name } = params;

	if (locals.session && locals.session.name === name) {
		throw redirect(302, '/profile');
	}

	const res = await fetch(`${PUBLIC_TREETALE_API_URL}/user/get/${name}`);
	const userInfo = await res.json();

	return userInfo;
};
