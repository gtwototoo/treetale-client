import Canvas from '$lib/components/Icons/Format/Canvas.svelte';
import Frames from '$lib/components/Icons/Format/Frames.svelte';
import Novella from '$lib/components/Icons/Format/Novella.svelte';
import type { FormatValues } from '$lib/types';

export const STORY_FORMATS: FormatValues[] = [
	{
		description: 'Блоки будут следовать друг за другом в виде ленты последовательных событий',
		icon: Canvas,
		id: 'canvas',
		title: 'Полотно'
	},
	{
		description: 'На странице будет отображаться только текущий активный блок',
		icon: Frames,
		id: 'frames',
		title: 'Фреймы'
	},
	{
		description: 'Изображение на весь экран, а текст и варианты выборов будут снизу',
		icon: Novella,
		id: 'novella',
		title: 'Новелла'
	}
];
