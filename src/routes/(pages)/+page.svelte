<script lang="ts">
	import { onMount } from 'svelte';

	import { page } from '$app/stores';
	import { MagnifyingGlass, Moon, RocketLaunch, Star, Sun } from 'svelte-heros-v2';
	import { Button, type HeroIconComponent, Icon, Input, Loading } from 'treetale-ui';

	import type { Searched } from '$lib/types';

	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import Category from '$lib/components/Category.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MainStatistic from '$lib/components/MainStatistic.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { GENRES_LIST } from '$lib/constants/genres';
	import { searchStories } from '$lib/requests/story';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { rootStyle } from '$lib/utils/customColors';
	import { correctWhitespace } from '$lib/utils/text';

	let { data } = $props();

	let value = $state('');
	let searchedGenres = $state<string[]>([]);
	let searched = $state<Searched | null>(null);
	let loading = $state(false);
	let timer = $state<number>();

	const genresSearchParams = $page.url.searchParams.get('genres')?.split(',');
	const stringSearchParams = $page.url.searchParams.get('string');

	bodyBackgroundColorStore.color = DEFAULT_COLOR;

	const icons: Record<string, HeroIconComponent> = {
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

		if (!searchedGenres.length && !value) {
			searched = null;
			loading = false;

			return;
		}

		timer = window.setTimeout(async () => {
			try {
				const { message } = await searchStories(value, searchedGenres);

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

		if (value || searchedGenres.length) {
			searching();
		}
	});
</script>

<svelte:head>
	{@html rootStyle(bodyBackgroundColorStore.color)}
	<title>TREETALE</title>
	<meta
		name="description"
		content="есплатное кроссплатформенное web-приложение, созданное для просмотра и создания интерактивных
		нелинейных историй. Все добавленные авторами истории находятся на главном экране, что
		позволяет найти большее количество читателей, а добавление истории происходит с помощью
		создания интуитивно понятных node-схем с описанием, иллюстрациями и вариантами выбора."
	/>
</svelte:head>

<div class="flex grow justify-center overflow-hidden">
	<section class="flex w-full max-w-[120rem] flex-col gap-6 py-4">
		<MainStatistic statistic={data.statistic} />
		{#if data.categories.length}
			<div class="flex w-full flex-col items-center gap-4 px-4">
				<h1 class="w-full select-none py-4 text-center leading-9 text-text">Список историй</h1>
				<Input
					bind:value
					class="w-full max-w-4xl bg-white p-4 text-2xl hover:bg-main-10"
					oninput={handleInput}
					placeholder="Поиск"
					size="lg"
				>
					{#snippet left()}
						<Icon
							class="pointer-events-none ml-3 mr-4 size-8 shrink-0 text-gray-800 *:stroke-2"
							this={loading ? Loading : MagnifyingGlass}
						/>
					{/snippet}
				</Input>
				<div class="flex w-full flex-wrap items-center justify-center gap-3">
					{#each GENRES_LIST as { icon: GenreIcon, id, title }}
						<Button
							class={clm(
								'h-20 w-24 flex-col justify-center gap-1 bg-main-50 hover:bg-main-70 max-sm:flex-1',
								searchedGenres.includes(id) && 'bg-main'
							)}
							onclick={() => switchGenre(id)}
							size="lg"
						>
							<GenreIcon class="size-8" />
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
				<AddStoryButton class="gap-3 bg-main-50 text-text hover:bg-main-70" />
			</div>
		{/if}
	</section>
</div>
<Footer />
