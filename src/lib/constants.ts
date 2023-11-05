import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
import type { ISize, TRGB } from '$lib/types';

export const BLACK_COLOR: TRGB = [5, 5, 5];
export const DEFAULT_COLOR: TRGB = [254, 215, 170];
export const WHITE_COLOR: TRGB = [250, 250, 250];
export const ICON_TYPE = 'outline';

export const USER_WITHOUT_WORKSPACE = {
	_id: 0,
	zoom: 0,
	offset: 0,
	frames: 0
};

export const DEFAULT_FRAME_SIZE: ISize = { width: 256, height: 180 };

export const NOT_FOUND_VARIANTS: Array<App.Error> = [
	{
		message:
			'Вы забрели в темный уголок, откуда не видно света, вам придется вернуться назад и найти другой путь.',
		img: `${PUBLIC_TREETALE_CLIENT_URL}/compressed/404_boy@1024x1024.png`,
		color: [209, 209, 198]
	},
	{
		message:
			'Эта дорога уходит далеко за горизонт и впереди только пустота, думаю дальше будет тоже самое.',
		img: `${PUBLIC_TREETALE_CLIENT_URL}/compressed/404_road@1024x1024.png`,
		color: [123, 85, 58]
	},
	{
		message:
			'Вы прогуливались по полю и вдруг увидели страшный заброшенный дом и в далеке слышился вой волков, думаю стоит вернуться обратно...',
		img: `${PUBLIC_TREETALE_CLIENT_URL}/compressed/404_house@1024x1024.png`,
		color: [30, 47, 49]
	}
];
