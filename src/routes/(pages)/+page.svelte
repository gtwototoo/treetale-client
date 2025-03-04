<script lang="ts">
	import { page } from '$app/state';
	import { onMount, type Component } from 'svelte';

	import { MagnifyingGlass, Moon, RocketLaunch, Star, Sun } from 'svelte-heros-v2';
	import { MetaTags } from 'svelte-meta-tags';
	import { Button, Icon, Input, Loading } from 'treetale-ui';

	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import Category from '$lib/components/Category.svelte';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { searchStories } from '$lib/requests/story';
	import type { Searched, StoryFormat } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { correctWhitespace } from '$lib/utils/text';

	import Footer from './Footer.svelte';
	import MainStatistic from './MainStatistic.svelte';

	const { data } = $props();

	let value = $state('');
	let searchedGenres = $state<string[]>([]);
	let searchedFormat = $state<StoryFormat | null>(null);
	let searched = $state<Searched | null>(null);
	let loading = $state(false);
	let timer = $state<number>();

	const genresSearchParams = page.url.searchParams.get('genres')?.split(',');
	const formatSearchParams = page.url.searchParams.get('format');
	const stringSearchParams = page.url.searchParams.get('string');
	const icons: Record<string, Component> = {
		dark_theme: Moon,
		light_theme: Sun,
		news: RocketLaunch
	};

	const switchGenre = (id: string) => {
		if (searchedGenres.includes(id)) {
			searchedGenres.splice(searchedGenres.indexOf(id), 1);
		} else {
			searchedGenres.push(id);
		}

		searching();
	};

	const searching = () => {
		clearTimeout(timer);

		loading = true;

		if (!searchedGenres.length && !value && !searchedFormat) {
			searched = null;
			loading = false;

			return;
		}

		timer = window.setTimeout(async () => {
			try {
				const { message } = await searchStories(value, searchedGenres, searchedFormat);

				searched = { authors: message!.authors, stories: message!.stories };
			} catch (error) {
				console.error(error);
			}

			loading = false;
		}, 500);
	};

	const handleInput = () => {
		searching();
	};

	onMount(() => {
		if (stringSearchParams) {
			value = stringSearchParams;
		}
		if (genresSearchParams) {
			searchedGenres = genresSearchParams;
		}
		if (formatSearchParams) {
			searchedFormat = formatSearchParams as StoryFormat;
		}

		if (value || searchedGenres.length || searchedFormat) {
			searching();
		}
	});
</script>

<MetaTags
	title="TREETALE (Истории, новеллы, RPG)"
	description="Бесплатное кроссплатформенное web-приложение, созданное для просмотра и создания интерактивных
		нелинейных историй. Все добавленные авторами истории находятся на главном экране, что
		позволяет найти большее количество читателей, а добавление истории происходит с помощью
		создания интуитивно понятных node-схем с описанием, иллюстрациями и вариантами выбора."
/>

<div class="flex grow justify-center overflow-hidden">
	<section class="flex w-full max-w-[120rem] flex-col gap-6 py-4">
		<MainStatistic statistic={data.statistic} />
		{#if data.categories.length}
			<div class="flex w-full flex-col items-center gap-4 px-4">
				<h1 class="adaptive-font-upper text-text w-full text-center leading-tight select-none">
					Список историй
				</h1>
				<Input
					bind:value
					class="adaptive-font-upper hover:bg-main-100 w-full max-w-2xl bg-white p-4"
					oninput={handleInput}
					placeholder="Поиск"
					size="lg"
				>
					{#snippet left()}
						<Icon
							class="pointer-events-none mx-3 size-8 shrink-0 text-gray-800 *:stroke-2 max-md:mx-1 max-md:size-6"
							this={loading ? Loading : MagnifyingGlass}
						/>
					{/snippet}
				</Input>
				<div class="flex w-full max-w-2xl flex-wrap items-center justify-center gap-3 max-md:gap-1">
					{#each GENRES_LIST as { icon: GenreIcon, id, title } (id)}
						<Button
							class={clm(
								'bg-main-500 hover:bg-main-700 h-20 w-24 flex-col justify-center gap-1 py-0 max-md:h-16 max-sm:flex-1',
								searchedGenres.includes(id) && 'bg-main'
							)}
							onclick={() => switchGenre(id)}
							size="lg"
						>
							<GenreIcon class="size-8 max-md:size-6" />
							<p class="text-xs">{title}</p>
						</Button>
					{/each}
				</div>
			</div>
			{#if (value || searchStories.length) && searched}
				<Category
					authors={searched.authors}
					icon={MagnifyingGlass}
					listFormat
					stories={searched.stories}
					title="Результаты поиска"
				/>
			{:else}
				{#each data.categories as { id, stories, title } (id)}
					<Category authors={data.authors} icon={icons[id] || Star} {stories} {title} />
				{/each}
			{/if}
		{:else}
			<div class="plug flex-grow gap-8">
				<p>
					{correctWhitespace('Историй не найдено, но вы можете добавить свою уникальную историю')}
				</p>
				<AddStoryButton class="bg-main-500 text-text hover:bg-main-700 gap-3" />
			</div>
		{/if}
	</section>
</div>
<Footer />
