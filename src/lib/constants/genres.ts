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
];
