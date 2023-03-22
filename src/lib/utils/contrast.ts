import type { RGB } from '$lib/types';

const luminance = (rgb: RGB) => {
	const a = rgb.map((v) => {
		v /= 255;

		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});

	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// minimal recommended contrast ratio is 4.5, or 3 for larger font-sizes
const contrast = (rgb1: RGB, rgb2: RGB) => {
	const lum1 = luminance(rgb1);
	const lum2 = luminance(rgb2);
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);

	return (brightest + 0.05) / (darkest + 0.05);
};

const contrastText = (rgb: RGB, compare1: RGB = [0, 0, 0], compare2: RGB = [255, 255, 255]) => {
	const contrasts = [contrast(rgb, compare1), contrast(rgb, compare2)];
	const max = Math.max(...contrasts);

	return contrasts.indexOf(max);
};

export default contrastText;
