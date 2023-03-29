import { BLACK_COLOR, WHITE_COLOR } from '$lib/constants';
import type { RGB } from '$lib/types';
import { contrastText } from './contrast';

const varStyle = (extend: object = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${value.join(' ')}`)
		.join(';');
};

export const rootStyle = (color: RGB) => {
	return `<${'style'} type="text/css">:root{${varStyle({
		'color-main': color,
		'color-text': contrastText(color) ? WHITE_COLOR : BLACK_COLOR
	})}}</style>`;
};
