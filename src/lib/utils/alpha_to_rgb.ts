import type { RGB } from '$lib/types';

export const alphaToRgb = (rgb: RGB, alpha: number) => {
	return rgb.map((color) => {
		return Math.round((1 - alpha) * 255 + alpha * color);
	}) as RGB;
};
