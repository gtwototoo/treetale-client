import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';

import type { ISize, TRGB } from '$lib/types';

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

export const DEFAULT_FRAME_SIZE: ISize = { height: 200, width: 256 };

export const NOT_FOUND_VARIANTS: Array<App.Error> = [
	{
		color: [189, 156, 121],
		img: `${PUBLIC_TREETALE_CLIENT_URL}/img/boy.png`,
		message:
			'Вы забрели в темный уголок, откуда не видно света, вам придется вернуться назад и найти другой путь.'
	},
	{
		color: [246, 193, 179],
		img: `${PUBLIC_TREETALE_CLIENT_URL}/img/road.png`,
		message:
			'Эта дорога уходит далеко за горизонт и впереди только пустота, думаю дальше будет тоже самое.'
	},
	{
		color: [30, 47, 49],
		img: `${PUBLIC_TREETALE_CLIENT_URL}/img/house.png`,
		message:
			'Вы прогуливались по лесу, не заметили как стемнело и вдруг увидели страшный заброшенный дом, а вдалеке слышался вой волков, думаю стоит вернуться...'
	}
];

export const GENRES_LIST = [
	{
		icon: Horror,
		id: 'horror',
		title: 'Ужасы'
	},
	{
		icon: Humor,
		id: 'humor',
		title: 'Юмор'
	},
	{
		icon: Adventure,
		id: 'adventure',
		title: 'Авантюра'
	},
	{
		icon: Fantastic,
		id: 'fantastic',
		title: 'Фантастика'
	},
	{
		icon: Historical,
		id: 'historical',
		title: 'История'
	},
	{
		icon: Action,
		id: 'action',
		title: 'Боевик'
	},
	{
		icon: Fantasy,
		id: 'fantasy',
		title: 'Фэнтези'
	},
	{
		icon: Romance,
		id: 'romance',
		title: 'Романтика'
	},
	{
		icon: Detective,
		id: 'detective',
		title: 'Детектив'
	},
	{
		icon: Thriller,
		id: 'thriller',
		title: 'Триллер'
	},
	{
		icon: Adult,
		id: 'adult',
		title: 'Взрослое'
	},
	{
		icon: Drama,
		id: 'drama',
		title: 'Драма'
	}
] as const;

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
