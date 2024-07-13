import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';

export const NOT_FOUND_VARIANTS: App.Error[] = [
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
