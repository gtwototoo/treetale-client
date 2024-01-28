<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { MagnifyingGlass, Moon, RocketLaunch, Star, Sun } from 'svelte-heros-v2';
	import { MetaTags } from 'svelte-meta-tags';

	import type { ISearched, TGenre } from '$lib/types';

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
	import { correctWhitespace, rootStyle } from '$lib/utils';

	export let data;

	let value = '';
	let searchedGenres: Array<TGenre> = [];
	let searched: ISearched;
	let loading = false;

	let timer: number;

	$bodyColorStore = DEFAULT_COLOR;

	const icons: Record<string, typeof SvelteComponent<unknown>> = {
		dark_theme: Moon,
		light_theme: Sun,
		news: RocketLaunch
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
			const { authors, stories } = await searchStories(value, searchedGenres);

			searched = { authors, stories };

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
	description="Бесплатное кроссплатформенное web-приложение, созданное для просмотра и создания интерактивных нелинейных историй. Все добавленные авторами истории находятся на главном экране, что позволяет найти большее количество читателей, а добавление истории происходит с помощью создания интуитивно понятных node-схем с описанием, иллюстрациями и вариантами выбора."
	title="TREETALE"
/>

<div class="flex min-h-full justify-center overflow-hidden">
	<section class="flex w-full max-w-[120rem] flex-col gap-6 py-4">
		<MainStatistic statistic={data.statistic} />
		{#if data.categories.length}
			<div class="flex w-full flex-col items-center gap-4 px-4">
				<h1 class="w-full select-none py-4 text-center leading-9 text-text">Список историй</h1>
				<Input
					bind:value
					class="w-full max-w-lg"
					on:input={handleInput}
					placeholder="Поиск"
					size="lg"
				>
					<svelte:fragment slot="left">
						<Icon
							class="pointer-events-none size-6 shrink-0 text-gray-800"
							type={loading ? Loading : MagnifyingGlass}
						/>
					</svelte:fragment>
				</Input>
				<div class="flex w-full flex-wrap items-center justify-center gap-3">
					{#each GENRES_LIST as { icon, id, title }}
						<Button
							class="h-20 w-24 flex-col gap-1 bg-white max-sm:flex-1"
							on:click={() => switchGenre(id)}
							size="lg"
							variant={searchedGenres.includes(id) ? 'main' : 'ghost'}
						>
							<svelte:component this={icon} class="size-8" />
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
				{#each data.categories as { id, stories, title }}
					<Category authors={data.authors} icon={icons[id] || Star} {stories} {title} />
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
