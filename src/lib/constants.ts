import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
import type { TRGB } from '$lib/types';

export const BLACK_COLOR: TRGB = [0, 0, 0];
export const DEFAULT_COLOR: TRGB = [254, 215, 170];
export const WHITE_COLOR: TRGB = [255, 255, 255];
export const ICON_TYPE = 'outline';

export const DEFAULT_FRAME_HEIGHT = 156;

export const USER_WITHOUT_WORKSPACE = {
	_id: 0,
	scale: 0,
	offset: 0,
	frames: 0
};

export const NOT_FOUND_VARIANTS: App.Error[] = [
	{
		message:
			'Вы забрели в темный уголок, откуда не видно света, вам придется вернуться назад и найти другой путь.',
		img: `${PUBLIC_TREETALE_CLIENT_URL}/compressed/404_boy@1024x1024.png`,
		color: [209, 209, 198],
		theme: 'light'
	},
	{
		message:
			'Эта дорога уходит далеко за горизонт и впереди только пустота, думаю дальше будет тоже самое.',
		img: `${PUBLIC_TREETALE_CLIENT_URL}/compressed/404_road@1024x1024.png`,
		color: [123, 85, 58],
		theme: 'light'
	},
	{
		message:
			'Вы прогуливались по полю и вдруг увидели страшный заброшенный дом и в далеке слышился вой волков, думаю стоит вернуться обратно...',
		img: `${PUBLIC_TREETALE_CLIENT_URL}/compressed/404_house@1024x1024.png`,
		color: [30, 47, 49],
		theme: 'dark'
	}
];
