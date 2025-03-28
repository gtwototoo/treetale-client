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
		.map(([key, value]) => `--${key}:${rgbToString(value)}`)
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

export const stringToRgb = (colorString: string) => {
	return colorString
		.replace(/rgb\((\d*), (\d*), (\d*)\)/, '$1 $2 $3')
		.split(' ')
		.map((v) => +v) as RGB;
};

export const rgbToHsl = (rgb: RGB) => {
	rgb = rgb.map((color) => color / 255) as RGB;
	let hsl = [0, 0, 0];

	const max = Math.max(...rgb);
	const min = Math.min(...rgb);

	hsl = hsl.map(() => (max + min) / 2);

	if (max == min) {
		hsl[0] = 0;
		hsl[1] = 0;
	} else {
		const difference = max - min;

		hsl[1] = hsl[2] > 0.5 ? difference / (2 - max - min) : difference / (max + min);

		switch (max) {
			case rgb[0]:
				hsl[0] = (rgb[1] - rgb[2]) / difference + (rgb[1] < rgb[2] ? 6 : 0);
				break;
			case rgb[1]:
				hsl[0] = (rgb[2] - rgb[0]) / difference + 2;
				break;
			case rgb[2]:
				hsl[0] = (rgb[0] - rgb[1]) / difference + 4;
				break;
		}

		hsl[0] = hsl[0] * 0.6;
	}

	hsl = hsl.map((value) => Math.round(value * 100));

	return hsl;
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

export const rgbToString = (color: RGB) => {
	return `rgb(${color.join(' ')})`;
};
