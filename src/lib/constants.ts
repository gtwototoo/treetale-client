import { PUBLIC_TREESTORY_CLIENT_URL } from '$env/static/public';
import type { RGB } from '$lib/types';
import clsx from 'clsx';

export const BLACK_COLOR: RGB = [0, 0, 0];
export const DEFAULT_COLOR: RGB = [254, 215, 170];
export const WHITE_COLOR: RGB = [255, 255, 255];
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
		img: `${PUBLIC_TREESTORY_CLIENT_URL}/compressed/404_boy@1024x1024.png`,
		color: [209, 209, 198]
	},
	{
		message:
			'Эта дорога уходит далеко за горизонт и впереди только пустота, думаю дальше будет тоже самое.',
		img: `${PUBLIC_TREESTORY_CLIENT_URL}/compressed/404_road@1024x1024.png`,
		color: [123, 85, 58]
	},
	{
		message:
			'Вы прогуливались по полю и вдруг увидели страшный заброшенный дом и в далеке слышился вой волков, думаю стоит вернуться обратно...',
		img: `${PUBLIC_TREESTORY_CLIENT_URL}/compressed/404_house@1024x1024.png`,
		color: [30, 47, 49]
	}
];

export const ADAPTIVE_FONT = clsx('!text-2xl max-hd:!text-xl max-xl:!text-lg max-sm:!text-base');
export const ADAPTIVE_FONT_UPPER = clsx(
	'!text-4xl max-hd:!text-3xl max-xl:!text-2xl max-sm:!text-xl'
);
export const ADAPTIVE_PADDING = clsx('!px-8 !py-4 max-hd:!px-6 max-hd:!py-3');
