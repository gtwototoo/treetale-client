import { BLACK_COLOR, WHITE_COLOR } from '$lib/constants';
import type { RGB } from '$lib/types';
import { alphaToRgb } from './alpha_to_rgb';
import { contrastText } from './contrast';

const varStyle = (extend: object = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${value.join(' ')}`)
		.join(';');
};

export const rootStyle = (color: RGB) => {
	const contrast = contrastText(color);

	return `<${'style'} type="text/css">:root{${varStyle({
		'color-main': color,
		'color-main-30': alphaToRgb(color, 0.3),
		'color-main-20': alphaToRgb(color, 0.2),
		'color-text': contrast ? WHITE_COLOR : BLACK_COLOR,
		'color-contrast': contrast ? BLACK_COLOR : WHITE_COLOR
	})}}</style>`;
};
