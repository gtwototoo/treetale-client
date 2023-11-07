import { alphaToRgb } from './alpha_to_rgb';
import { contrastText } from './contrast';

import { BLACK_COLOR, BLACK_TEXT_COLOR, WHITE_COLOR, WHITE_TEXT_COLOR } from '$lib/constants';
import type { TRGB } from '$lib/types';

export const varColors = (extend: Record<string, TRGB> = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${value.join(' ')}`)
		.join(';');
};

export const varStyles = (extend: Record<string, string> = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
};

const generateMainColors = (color: TRGB) => {
	const contrast = contrastText(color);

	const additionalColors: Record<string, TRGB> = {
		'color-main': color,
		'color-text': contrast ? WHITE_TEXT_COLOR : BLACK_TEXT_COLOR,
		'color-contrast': contrast ? BLACK_COLOR : WHITE_COLOR
	};

	for (const i in new Array(9).fill(undefined)) {
		additionalColors[`color-main-${+i + 1}0`] = alphaToRgb(
			color,
			(+i + 1) / 10,
			contrast ? BLACK_COLOR : WHITE_COLOR
		);
	}

	return varColors(additionalColors);
};

export const rootStyle = (mainColor: TRGB, additionalStyles?: Record<string, string>) => {
	const styles = [generateMainColors(mainColor), varStyles(additionalStyles)].join(';');

	return `<${'style'} type="text/css">:root{${styles}}</style>`;
};

export const RGB = (color: TRGB) => {
	return color.join(' ');
};
