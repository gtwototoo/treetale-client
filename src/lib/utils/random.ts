import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
import type { HttpError, NumericRange } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

import sample from 'lodash/sample';

import { NOT_FOUND_VARIANTS } from '$lib/constants/notFound';

export const randomError = (status: NumericRange<400, 599>): HttpError => {
	return error(
		status,
		status === 404
			? sample(NOT_FOUND_VARIANTS)
			: {
					color: [0, 38, 58],
					img: `${PUBLIC_TREETALE_CLIENT_URL}/img/universe.png`,
					message:
						'Случилось что-то ужасное, мир схлопнулся в маленькую точку и теперь лучшие небесные кузнецы пытаются вернуть его в исходное состояние.'
				}
	);
};
