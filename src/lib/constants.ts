import type { ISize, TRGB } from '$lib/types';

import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
import Action from '$lib/components/icons/genres/Action.svelte';
import Adult from '$lib/components/icons/genres/Adult.svelte';
import Adventure from '$lib/components/icons/genres/Adventure.svelte';
import Detective from '$lib/components/icons/genres/Detective.svelte';
import Drama from '$lib/components/icons/genres/Drama.svelte';
import Fantastic from '$lib/components/icons/genres/Fantastic.svelte';
import Fantasy from '$lib/components/icons/genres/Fantasy.svelte';
import Historical from '$lib/components/icons/genres/Historical.svelte';
import Horror from '$lib/components/icons/genres/Horror.svelte';
import Humor from '$lib/components/icons/genres/Humor.svelte';
import Romance from '$lib/components/icons/genres/Romance.svelte';
import Thriller from '$lib/components/icons/genres/Thriller.svelte';

export const BLACK_COLOR: TRGB = [5, 5, 5];
export const DEFAULT_COLOR: TRGB = [254, 215, 170];
export const WHITE_COLOR: TRGB = [255, 255, 255];
export const WHITE_TEXT_COLOR: TRGB = [220, 220, 220];
export const BLACK_TEXT_COLOR: TRGB = [25, 25, 25];
export const ICON_TYPE = 'outline';

export const USER_WITHOUT_WORKSPACE = {
	_id: 0,
	zoom: 0,
	offset: 0,
	frames: 0
};

export const DEFAULT_FRAME_SIZE: ISize = { width: 256, height: 184 };

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

export const GENRES_LIST = [
	{
		title: 'Ужасы',
		icon: Horror,
		id: 'horror'
	},
	{
		title: 'Юмор',
		icon: Humor,
		id: 'humor'
	},
	{
		title: 'Приключение',
		icon: Adventure,
		id: 'adventure'
	},
	{
		title: 'Фантастика',
		icon: Fantastic,
		id: 'fantastic'
	},
	{
		title: 'История',
		icon: Historical,
		id: 'historical'
	},
	{
		title: 'Боевик',
		icon: Action,
		id: 'action'
	},
	{
		title: 'Фэнтези',
		icon: Fantasy,
		id: 'fantasy'
	},
	{
		title: 'Романтика',
		icon: Romance,
		id: 'romance'
	},
	{
		title: 'Детектив',
		icon: Detective,
		id: 'detective'
	},
	{
		title: 'Триллер',
		icon: Thriller,
		id: 'thriller'
	},
	{
		title: 'Взрослое',
		icon: Adult,
		id: 'adult'
	},
	{
		title: 'Драма',
		icon: Drama,
		id: 'drama'
	}
];

// export const GENRES_LIST = {
// 	horror: {
// 		title: 'Ужасы',
// 		icon: Horror
// 	},
// 	humor: {
// 		title: 'Юмор',
// 		icon: Humor
// 	},
// 	adventure: {
// 		title: 'Приключение',
// 		icon: Adventure
// 	},
// 	fantastic: {
// 		title: 'Фантастика',
// 		icon: Fantastic
// 	},
// 	historical: {
// 		title: 'История',
// 		icon: Historical
// 	},
// 	action: {
// 		title: 'Боевик',
// 		icon: Action
// 	},
// 	fantasy: {
// 		title: 'Фэнтези',
// 		icon: Fantasy
// 	},
// 	romance: {
// 		title: 'Романтика',
// 		icon: Romance
// 	},
// 	detective: {
// 		title: 'Детектив',
// 		icon: Detective
// 	},
// 	thriller: {
// 		title: 'Триллер',
// 		icon: Thriller
// 	},
// 	adult: {
// 		title: 'Взрослое',
// 		icon: Adult
// 	},
// 	drama: {
// 		title: 'Драма',
// 		icon: Drama
// 	}
// };
