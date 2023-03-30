import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = locals.session;

	if (!user) throw redirect(302, '/');

	return {
		stories: []
	};
};
