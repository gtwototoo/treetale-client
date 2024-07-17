import { BLACK_COLOR } from '$lib/constants/colors';
import type { RGB } from '$lib/types';

export const alphaToRgb = (rgb: RGB, alpha: number, backColor: RGB = [255, 255, 255]) => {
	if (!rgb || !rgb.length) return BLACK_COLOR;

	return rgb.map((color, index) => {
		return Math.round((1 - alpha) * backColor[index] + alpha * color);
	}) as RGB;
};
