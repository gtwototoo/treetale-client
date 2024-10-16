import Action from '$lib/components/Icons/Genres/Action.svelte';
import Adult from '$lib/components/Icons/Genres/Adult.svelte';
import Adventure from '$lib/components/Icons/Genres/Adventure.svelte';
import Detective from '$lib/components/Icons/Genres/Detective.svelte';
import Drama from '$lib/components/Icons/Genres/Drama.svelte';
import Fantastic from '$lib/components/Icons/Genres/Fantastic.svelte';
import Fantasy from '$lib/components/Icons/Genres/Fantasy.svelte';
import Historical from '$lib/components/Icons/Genres/Historical.svelte';
import Horror from '$lib/components/Icons/Genres/Horror.svelte';
import Humor from '$lib/components/Icons/Genres/Humor.svelte';
import Romance from '$lib/components/Icons/Genres/Romance.svelte';
import Thriller from '$lib/components/Icons/Genres/Thriller.svelte';
import type { Genre } from '$lib/types';

export const GENRES_LIST: Genre[] = [
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
];
