import type { Config } from 'tailwindcss';

import range from 'lodash/range';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

const colorsList = [
	'main',
	...range(9).map((index) => `main-${index + 1}0`),
	...range(9).map((index) => `contrast-${index + 1}`),
	'text',
	'contrast'
];

function withOpacityValue(variable: string) {
	return ({ opacityValue = 1 }) => {
		if (opacityValue === undefined) {
			return `rgb(var(${variable}))`;
		}
		return `rgb(var(${variable}) / ${opacityValue})`;
	};
}

function toColorValue(maybeFunction: (obj: object) => string | string) {
	return typeof maybeFunction === 'function' ? maybeFunction({}) : maybeFunction;
}

const colors = colorsList.reduce(
	(obj, value) => ({ ...obj, [value]: withOpacityValue(`--color-${value}`) }),
	{}
);

const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/treetale-ui/**/*.{html,js,svelte,ts}'
	],

	plugins: [
		plugin(({ addUtilities, addVariant, matchUtilities, theme }) => {
			addVariant('thumb', '&::-webkit-scrollbar-thumb');
			addVariant('scrollbar', '&::-webkit-scrollbar');
			addVariant('rngthumb', ['&::-webkit-slider-thumb', '&::-moz-range-thumb', '&::-ms-thumb']);
			addVariant('rngtrack', [
				'&::-webkit-slider-runnable-track',
				'&::-moz-range-track',
				'&::-ms-track'
			]);

			addUtilities({
				'.fill-gradient': {
					fill: 'var(--fill-gradient)'
				},
				'.inherit-align': {
					'text-align': 'inherit'
				},
				'.scrollbar-none': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none'
				},
				'.scrollbar-none::-webkit-scrollbar': {
					display: 'none'
				}
			});

			matchUtilities(
				{
					'text-shadow': (value) => ({
						textShadow: value
					})
				},
				{ values: theme('textShadow') }
			);
			matchUtilities(
				{
					'bg-with-border': (value) => ({
						background: `linear-gradient(${value}, ${value}) padding-box, linear-gradient(to bottom, var(--background-from), var(--background-to)) border-box`
					}),
					'border-from': (value) => ({
						'--background-from': toColorValue(value)
					}),
					'border-to': (value) => ({
						'--background-to': toColorValue(value)
					})
				},
				{ type: ['color'], values: theme('colors') }
			);
			matchUtilities(
				{
					stop: (value) => ({
						'stop-color': toColorValue(value)
					})
				},
				{ type: ['color'], values: theme('colors') }
			);
			matchUtilities(
				{
					'grid-cols-fit': (value) => ({
						'grid-template-columns': `repeat(auto-fit, minmax(${value}, 1fr))`
					})
				},
				{ values: theme('spacing') }
			);
		})
	],

	theme: {
		extend: {
			borderRadius: {
				inherit: 'inherit'
			},
			colors,
			fontFamily: {
				RobotoSlab: ['Roboto Slab', ...defaultTheme.fontFamily.sans]
			},
			lineHeight: {
				0: '0'
			},
			screens: {
				fd: '1920px',
				hd: '1600px',
				xs: '480px'
			},
			textShadow: {
				DEFAULT: '0 2px 4px var(--tw-shadow-color)',
				lg: '0 8px 16px var(--tw-shadow-color)',
				sm: '0 1px 2px var(--tw-shadow-color)'
			}
		}
	}
};

export default config satisfies Config;
