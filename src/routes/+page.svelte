<script lang="ts">
	import { MagnifyingGlass, Moon, RocketLaunch, Star, Sun } from 'svelte-heros-v2';

	import { Button, Input } from '$UI';
	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import MainStatistic from '$lib/components/MainStatistic.svelte';
	import { Loading } from '$lib/components/icons';
	import Category from '$lib/components/modules/Category.svelte';
	import MainFooter from '$lib/components/modules/Footer/MainFooter.svelte';
	import { DEFAULT_COLOR, GENRES_LIST } from '$lib/constants';
	import { searchStories } from '$lib/requests/story';
	import { bodyColorStore } from '$lib/stores/main';
	import type { ISearched, TGenre } from '$lib/types';
	import { correctWhitespace, rootStyle } from '$lib/utils';
	import type { SvelteComponent } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;

	let value = '';
	let searchedGenres: Array<TGenre> = [];
	let searched: ISearched;
	let loading = false;

	let timer: number;

	$bodyColorStore = DEFAULT_COLOR;

	const icons: Record<string, typeof SvelteComponent<unknown>> = {
		news: RocketLaunch,
		dark_theme: Moon,
		light_theme: Sun
	};

	const switchGenre = (id: TGenre) => {
		if (searchedGenres.includes(id)) {
			searchedGenres.splice(searchedGenres.indexOf(id), 1);
		} else {
			searchedGenres.push(id);
		}

		searchedGenres = searchedGenres;

		searching();
	};

	const searching = () => {
		clearTimeout(timer);

		loading = true;

		if (!searchedGenres.length && !value) {
			searched = null;
			loading = false;

			return;
		}

		timer = window.setTimeout(async () => {
			const { stories, authors } = await searchStories(value, searchedGenres);

			searched = { stories, authors };

			loading = false;
		}, 500);
	};

	const handleInput = () => {
		searching();
	};
</script>

<svelte:head>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<MetaTags
	title="TREETALE"
	description="Бесплатное кроссплатформенное web-приложение, созданное для просмотра и создания интерактивных нелинейных историй. Все добавленные авторами истории находятся на главном экране, что позволяет найти большее количество читателей, а добавление истории происходит с помощью создания интуитивно понятных node-схем с описанием, иллюстрациями и вариантами выбора."
/>

<div class="flex min-h-full justify-center overflow-hidden">
	<section class="flex w-full max-w-[120rem] flex-col gap-6 py-4">
		<MainStatistic statistic={data.statistic} />
		{#if data.categories.length}
			<div class="flex w-full flex-col items-center gap-4 px-4">
				<h1 class="w-full select-none py-4 text-center leading-9 text-text">Список историй</h1>
				<Input
					placeholder="Поиск"
					bind:value
					size="lg"
					class="w-full max-w-lg"
					on:input={handleInput}
				>
					<svelte:fragment slot="left">
						<Icon
							type={loading ? Loading : MagnifyingGlass}
							class="pointer-events-none mr-5 h-6 w-6 text-gray-800"
						/>
					</svelte:fragment>
				</Input>
				<div class="flex w-full flex-wrap items-center justify-center gap-3">
					{#each GENRES_LIST as { title, icon, id }}
						<Button
							variant={searchedGenres.includes(id) ? 'main' : 'ghost'}
							size="lg"
							class="h-20 w-24 flex-col gap-1 bg-white max-sm:flex-1"
							on:click={() => switchGenre(id)}
						>
							<svelte:component this={icon} class="h-8 w-8" />
							<p class="text-xs">{title}</p>
						</Button>
					{/each}
				</div>
			</div>
			{#if (value || searchStories.length) && searched}
				<Category
					icon={MagnifyingGlass}
					listFormat
					title="Результаты поиска"
					stories={searched.stories}
					authors={searched.authors}
				/>
			{:else}
				{#each data.categories as { title, stories, id }}
					<Category icon={icons[id] || Star} {title} {stories} authors={data.authors} />
				{/each}
			{/if}
		{:else}
			<div class="plug flex-grow gap-8">
				<p>
					{correctWhitespace(
						'Историй не найдено, но вы можете добавить свою уникальную историю'
					)}
				</p>
				<AddStoryButton class="gap-3 bg-white" />
			</div>
		{/if}
	</section>
</div>
<MainFooter />
