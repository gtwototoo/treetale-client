import { error, type HttpError } from '@sveltejs/kit';

import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
import { NOT_FOUND_VARIANTS } from '$lib/constants';

export const randomInteger = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomArray = <T>(array: Array<T>): T => {
	return array[randomInteger(0, array.length - 1)];
};

export const randomError = (status: number): HttpError => {
	return error(
		status,
		status === 404
			? randomArray(NOT_FOUND_VARIANTS)
			: {
					message:
						'Случилось что-то ужасное, мир схлопнулся в маленькую точку и теперь лучшие небесные кузнецы пытаются вернуть его в исходное состояние.',
					img: `${PUBLIC_TREETALE_CLIENT_URL}/img/compressed/500_space@1024x1024.png`,
					color: [131, 15, 7]
			  }
	);
};
