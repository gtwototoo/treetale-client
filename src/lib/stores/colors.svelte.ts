import { DEFAULT_COLOR } from '$lib/constants/colors';
import { clm } from '$lib/utils/classMerge';

export type Theme = 'light' | 'dark';

const getTheme = () => {
	let _type = $state<Theme>('dark');

	return {
		get type() {
			return _type;
		},
		set type(value) {
			window.localStorage.setItem('theme', value);
			_type = value;
		}
	};
};

export const theme = getTheme();

export const currentThemeClass = (blackThemeClass: string, whiteThemeClass: string) => {
	return theme.type === 'dark' ? blackThemeClass : whiteThemeClass;
};

const getBodyBackgroundColor = () => {
	let _color = $state(DEFAULT_COLOR);

	return {
		get color() {
			return _color;
		},
		set color(value) {
			_color = value;
		}
	};
};

const getRedBackgroundColor = () => {
	const _color = $derived(
		currentThemeClass(
			clm('bg-red-900 hover:bg-red-800 text-red-500 ring-red-700'),
			clm('bg-red-100 hover:bg-red-200 text-red-500 ring-red-300')
		)
	);

	return {
		get color() {
			return _color;
		}
	};
};

export const bodyBackgroundColorStore = getBodyBackgroundColor();
export const redBackgroundColorStore = getRedBackgroundColor();
