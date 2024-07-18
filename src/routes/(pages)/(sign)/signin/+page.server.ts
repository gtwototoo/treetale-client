import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.session;

	if (user) {
		redirect(302, '/profile');
	}
};
