const plugin = require('tailwindcss/plugin');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [
		require('@tailwindcss/line-clamp'),
		plugin(({ addVariant, matchUtilities, theme, addUtilities, matchVariant }) => {
      addUtilities({
        '.inherit-align': {
          'text-align': 'inherit',
        },
      });
    })
	]
};

/** @type {import('tailwindcss').Config} */
module.exports = config;
