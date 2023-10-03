import type { TRGB } from '$lib/types';

export const alphaToRgb = (rgb: TRGB, alpha: number, backColor: TRGB = [255, 255, 255]) => {
	return rgb.map((color, index) => {
		return Math.round((1 - alpha) * backColor[index] + alpha * color);
	}) as TRGB;
};
