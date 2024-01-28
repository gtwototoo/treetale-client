import type { HttpError, NumericRange } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';

import { NOT_FOUND_VARIANTS } from '$lib/constants';

export const randomInteger = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomArray = <T>(array: Array<T>): T => {
	return array[randomInteger(0, array.length - 1)];
};

export const randomError = (status: NumericRange<400, 599>): HttpError => {
	return error(
		status,
		status === 404
			? randomArray(NOT_FOUND_VARIANTS)
			: {
					color: [0, 38, 58],
					img: `${PUBLIC_TREETALE_CLIENT_URL}/img/universe.png`,
					message:
						'Случилось что-то ужасное, мир схлопнулся в маленькую точку и теперь лучшие небесные кузнецы пытаются вернуть его в исходное состояние.'
				}
	);
};
