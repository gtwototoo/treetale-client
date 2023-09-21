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

	const additionalColors: Record<string, RGB> = {
		'color-main': color,
		'color-text': contrast ? WHITE_COLOR : BLACK_COLOR,
		'color-contrast': contrast ? BLACK_COLOR : WHITE_COLOR
	};

	for (const i in new Array(8).fill(undefined)) {
		additionalColors[`color-main-${+i + 1}0`] = alphaToRgb(color, (+i + 1) / 10);
	}

	return `<${'style'} type="text/css">:root{${varStyle(additionalColors)}}</style>`;
};
