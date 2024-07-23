import { DEFAULT_COLOR } from '$lib/constants/colors';
import { clm } from '$lib/utils/classMerge';
import { contrastText } from '$lib/utils/contrast';

export const currentThemeClass = (blackThemeClass: string, whiteThemeClass: string) => {
	return contrastText(bodyBackgroundColorStore.color) ? blackThemeClass : whiteThemeClass;
};

const getBodyBackgroundColor = () => {
	let color = $state(DEFAULT_COLOR);

	return {
		get color() {
			return color;
		},
		set color(value) {
			color = value;
		}
	};
};

const getRedBackgroundColor = () => {
	const color = $derived(currentThemeClass(clm('bg-red-900'), clm('bg-red-100')));

	return {
		get color() {
			return color;
		}
	};
};

export const bodyBackgroundColorStore = getBodyBackgroundColor();
export const redBackgroundColorStore = getRedBackgroundColor();
