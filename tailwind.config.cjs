const plugin = require('tailwindcss/plugin');

const colorsList = [
	'main',
	...new Array(9).fill(undefined).map((_, index) => `main-${index + 1}0`),
	'text',
	'contrast'
];

function withOpacityValue(variable) {
	return ({ opacityValue = 1 }) => {
		if (opacityValue === undefined) {
			return `rgb(var(${variable}))`;
		}
		return `rgb(var(${variable}) / ${opacityValue})`;
	};
}

function toColorValue(maybeFunction) {
	return typeof maybeFunction === 'function' ? maybeFunction({}) : maybeFunction;
}

const colors = colorsList.reduce(
	(obj, value) => ({ ...obj, [value]: withOpacityValue(`--color-${value}`) }),
	{}
);

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors,
			lineHeight: {
				0: '0'
			},
			screens: {
				xs: '480px',
				hd: '1600px',
				fd: '1920px'
			},
			borderRadius: {
				inherit: 'inherit'
			}
		}
	},

	plugins: [
		plugin(({ addVariant, matchUtilities, theme, addUtilities, matchVariant }) => {
			addVariant('childs', '& > *');
			addVariant('thumb', '&::-webkit-scrollbar-thumb');
			addVariant('scrollbar', '&::-webkit-scrollbar');
			addVariant('rngthumb', ['&::-webkit-slider-thumb', '&::-moz-range-thumb', '&::-ms-thumb']);
			addVariant('rngtrack', [
				'&::-webkit-slider-runnable-track',
				'&::-moz-range-track',
				'&::-ms-track'
			]);
			matchVariant('child', (value) => {
				return `& > ${value}`;
			});
			addUtilities({
				'.fill-gradient': {
					fill: 'var(--fill-gradient)'
				},
				'.scrollbar-none': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none'
				},
				'.scrollbar-none::-webkit-scrollbar': {
					display: 'none'
				},
				'.inherit-align': {
					'text-align': 'inherit'
				}
			});
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
				{ values: theme('colors'), type: ['color'] }
			);
			matchUtilities(
				{
					'light-gradient': (value) => ({
						background: `linear-gradient(#FFFFFF -125%, ${toColorValue(value)})`
					})
				},
				{ values: theme('colors'), type: ['color'] }
			);
			matchUtilities(
				{
					stop: (value) => ({
						'stop-color': toColorValue(value)
					})
				},
				{ values: theme('colors'), type: ['color'] }
			);
			matchUtilities(
				{
					'grid-columns-fit': (value) => ({
						'grid-template-columns': `repeat(auto-fit, minmax(${value}, 1fr))`
					})
				},
				{ values: theme('spacing') }
			);
		})
	]
};

/** @type {import('tailwindcss').Config} */
module.exports = config;
