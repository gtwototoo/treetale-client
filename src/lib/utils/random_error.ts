import { PUBLIC_TREESTORY_CLIENT_URL } from '$env/static/public';
import { NOT_FOUND_VARIANTS } from '$lib/constants';
import { error, type HttpError } from '@sveltejs/kit';
import { randomArray } from './random';

export const randomError = (status: number): HttpError => {
	return error(
		status,
		status === 404
			? randomArray(NOT_FOUND_VARIANTS)
			: {
					message:
						'Случилось что-то ужасное, мир схлопнулся в маленькую точку и теперь лучшие небесные кузнецы пытаются вернуть его в исходное состояние.',
					img: `${PUBLIC_TREESTORY_CLIENT_URL}/img/compressed/500_space@1024x1024.png`,
					color: [131, 15, 7]
			  }
	);
};
