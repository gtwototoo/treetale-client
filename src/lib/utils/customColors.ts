import range from 'lodash/range';

import type { RGB as RGBType } from '$lib/types';

import {
	BLACK_COLOR,
	BLACK_TEXT_COLOR,
	WHITE_COLOR,
	WHITE_TEXT_COLOR
} from '$lib/constants/colors';
import { alphaToRgb } from './alphaToRgb';
import { contrastText } from './contrast';

export const varColors = (extend: Record<string, RGBType> = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${value.join(' ')}`)
		.join(';');
};

export const varStyles = (extend: Record<string, string> = {}) => {
	return Object.entries(extend)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
};

export const generateMainColors = (color: RGBType) => {
	const contrast = contrastText(color);

	const additionalColors: Record<string, RGBType> = {
		'color-contrast': contrast ? BLACK_COLOR : WHITE_COLOR,
		'color-main': color,
		'color-text': contrast ? WHITE_TEXT_COLOR : BLACK_TEXT_COLOR
	};

	for (const i in range(9)) {
		additionalColors[`color-contrast-${+i + 1}`] = alphaToRgb(
			contrast ? WHITE_COLOR : BLACK_COLOR,
			(+i + 1) / 100,
			contrast ? BLACK_COLOR : WHITE_COLOR
		);
		additionalColors[`color-main-${+i + 1}0`] = alphaToRgb(
			color,
			(+i + 1) / 10,
			contrast ? BLACK_COLOR : WHITE_COLOR
		);
	}

	return varColors(additionalColors);
};

export const rootStyle = (mainColor?: RGBType, additionalStyles?: Record<string, string>) => {
	const styles = [];

	if (mainColor) {
		styles.push(generateMainColors(mainColor));
	}
	if (additionalStyles) {
		styles.push(varStyles(additionalStyles));
	}

	return `<${'style'} type="text/css">:root{${styles}}</style>`;
};

export const toRGB = (color: RGBType) => {
	return color.join(' ');
};
