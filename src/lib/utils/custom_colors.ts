import { BLACK_COLOR, WHITE_COLOR } from '$lib/constants';
import type { RGB } from '$lib/types';
import { alphaToRgb } from './alpha_to_rgb';
import { contrastText } from './contrast';

export const varColors = (extend: Record<string, RGB> = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${value.join(' ')}`)
		.join(';');
};

export const varStyles = (extend: Record<string, string> = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
};

const generateMainColors = (color: RGB) => {
	const contrast = contrastText(color);

	const additionalColors: Record<string, RGB> = {
		'color-main': color,
		'color-text': contrast ? WHITE_COLOR : BLACK_COLOR,
		'color-contrast': contrast ? BLACK_COLOR : WHITE_COLOR
	};

	for (const i in new Array(8).fill(undefined)) {
		additionalColors[`color-main-${+i + 1}0`] = alphaToRgb(
			color,
			(+i + 1) / 10,
			contrast ? BLACK_COLOR : WHITE_COLOR
		);
	}

	return varColors(additionalColors);
};

export const rootStyle = (mainColor: RGB, additionalStyles?: Record<string, string>) => {
	const styles = [generateMainColors(mainColor), varStyles(additionalStyles)].join(';');

	return `<${'style'} type="text/css">:root{${styles}}</style>`;
};
