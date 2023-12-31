<script lang="ts">
	import { MagnifyingGlass, Moon, RocketLaunch, Star, Sun } from 'svelte-heros-v2';

	import { Button, Image, Input } from '$UI';
	import { Loading } from '$UI/icons';
	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Category from '$lib/components/modules/Category.svelte';
	import MainFooter from '$lib/components/modules/Footer/MainFooter.svelte';
	import { DEFAULT_COLOR, GENRES_LIST } from '$lib/constants.js';
	import { searchStories } from '$lib/requests/story.js';
	import { bodyColorStore } from '$lib/stores/main';
	import type { ISearched } from '$lib/types';
	import { correctWhitespace, rootStyle } from '$lib/utils';
	import type { SvelteComponent } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;

	let value = '';
	let searched: ISearched;
	let loading = false;

	$bodyColorStore = DEFAULT_COLOR;

	const icons: Record<string, typeof SvelteComponent<unknown>> = {
		news: RocketLaunch,
		dark_theme: Moon,
		light_theme: Sun
	};

	const handleInput = () => {
		let timer: number;

		if (!value) {
			searched = null;
			clearTimeout(timer);

			return;
		}

		loading = true;

		timer = window.setTimeout(async () => {
			const { stories, authors } = await searchStories(value);

			searched = { stories, authors };

			loading = false;
		}, 1000);
	};
</script>

<svelte:head>
	<title>TREETALE</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<MetaTags
	title="TREETALE"
	description="Бесплатное кроссплатформенное web-приложение, созданное для просмотра и создания интерактивных нелинейных историй. Все добавленные авторами истории находятся на главном экране, что позволяет найти большее количество читателей, а добавление истории происходит с помощью создания интуитивно понятных node-схем с описанием, иллюстрациями и вариантами выбора."
/>

<div class="flex grow flex-col gap-6 py-4">
	<div class="flex justify-center px-4">
		<div class="flex w-full max-w-7xl justify-center rounded-2xl bg-white/50">
			<Image
				src="/banner.svg"
				alt="TREETALE"
				class="flex h-40 w-full max-w-fit rounded-inherit"
				cover
			/>
		</div>
	</div>
	{#if data.categories.length}
		<div class="flex w-full flex-col items-center gap-4 px-3">
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
			<div class="flex flex-wrap items-center justify-center gap-3">
				{#each GENRES_LIST as { title, icon }}
					<Button variant="ghost" size="lg" class="h-20 w-24 flex-col gap-1 bg-white">
						<svelte:component this={icon} class="h-8 w-8" />
						<p class="text-xs">{title}</p>
					</Button>
				{/each}
			</div>
		</div>
		{#if value && searched}
			<Category
				icon={MagnifyingGlass}
				listFormat
				title="Результаты поиска"
				stories={searched.stories}
				authors={searched.authors}
			/>
		{:else}
			{#each data.categories as { title, stories, id }}
				<Category
					icon={id in icons ? icons[id] : Star}
					{title}
					{stories}
					authors={data.authors}
				/>
			{/each}
		{/if}
	{:else}
		<div class="plug flex-grow gap-8">
			<p>
				{correctWhitespace('Историй не найдено, но вы можете добавить свою уникальную историю')}
			</p>
			<AddStoryButton class="gap-3 bg-white" />
		</div>
	{/if}
</div>
<MainFooter />
