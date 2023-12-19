<script lang="ts">
	import { MagnifyingGlass, Moon, RocketLaunch, Star, Sun } from 'svelte-heros-v2';

	import { Input } from '$UI';
	import Loading from '$UI/Icons/Loading.svelte';
	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Category from '$lib/components/modules/Category.svelte';
	import MainFooter from '$lib/components/modules/Footer/MainFooter.svelte';
	import { DEFAULT_COLOR } from '$lib/constants.js';
	import { searchStories } from '$lib/requests/story.js';
	import { bodyColorStore } from '$lib/stores/main';
	import type { ISearched } from '$lib/types/index.js';
	import { correctWhitespace, rootStyle } from '$lib/utils';
	import type { SvelteComponent } from 'svelte';

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

<div class="flex grow flex-col gap-6 py-4">
	{#if data.categories.length}
		<div class="flex w-full flex-col items-center gap-4 px-2">
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
