import range from 'lodash/range';

import {
	BLACK_COLOR,
	BLACK_TEXT_COLOR,
	WHITE_COLOR,
	WHITE_TEXT_COLOR
} from '$lib/constants/colors';
import type { RGB } from '$lib/types';

import { contrastText } from './contrast';

export const varColors = (extend: Record<string, RGB> = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${toRGB(value)}`)
		.join(';');
};

export const varStyles = (extend: Record<string, string> = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
};

export const generateMainColors = (color: RGB) => {
	const contrast = contrastText(color);

	const additionalColors: Record<string, RGB> = {
		'color-contrast': contrast ? BLACK_COLOR : WHITE_COLOR,
		'color-main': color,
		'color-text': contrast ? WHITE_TEXT_COLOR : BLACK_TEXT_COLOR
	};

	for (const i of range(9)) {
		additionalColors[`color-contrast-${(i + 1) * 100}`] = alphaToRgb(
			contrast ? WHITE_COLOR : BLACK_COLOR,
			(+i + 1) / 100,
			contrast ? BLACK_COLOR : WHITE_COLOR
		);
		additionalColors[`color-main-${(i + 1) * 100}`] = alphaToRgb(
			color,
			(+i + 1) / 10,
			contrast ? BLACK_COLOR : WHITE_COLOR
		);
	}

	return varColors(additionalColors);
};

export const alphaToRgb = (rgb: RGB, alpha: number, backColor: RGB = [255, 255, 255]) => {
	if (!rgb || !rgb.length) return BLACK_COLOR;

	return rgb.map((color, index) => {
		return Math.round((1 - alpha) * backColor[index] + alpha * color);
	}) as RGB;
};

export const rootStyle = (mainColor?: RGB, additionalStyles?: Record<string, string>) => {
	const styles = [];

	if (mainColor) {
		styles.push(generateMainColors(mainColor));
	}
	if (additionalStyles) {
		styles.push(varStyles(additionalStyles));
	}

	return `<${'style'} type="text/css">:root{${styles}}</style>`;
};

export const toRGB = (color: RGB) => {
	return `rgb(${color.join(' ')})`;
};
