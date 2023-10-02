import type { RGB } from '$lib/types';

export const alphaToRgb = (rgb: RGB, alpha: number, backColor: RGB = [255, 255, 255]) => {
	return rgb.map((color, index) => {
		return Math.round((1 - alpha) * backColor[index] + alpha * color);
	}) as RGB;
};
