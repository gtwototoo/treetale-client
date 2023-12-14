<script lang="ts">
	import { MagnifyingGlass, Moon, RocketLaunch, Sun } from 'svelte-heros-v2';

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

	export let data;

	let value = '';
	let searched: ISearched;
	let loading = false;

	$bodyColorStore = DEFAULT_COLOR;

	const handleInput = async () => {
		if (!value) {
			searched = null;

			return;
		}

		loading = true;

		const { stories, authors } = await searchStories(value);

		searched = { stories, authors };

		loading = false;
	};
</script>

<svelte:head>
	<title>TREETALE</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<div class="flex grow flex-col gap-6 py-4">
	{#if Object.keys(data.stories).length}
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
			<Category
				icon={RocketLaunch}
				title="Новинки"
				stories={data.stories.newStories}
				authors={data.authors}
			/>
			<Category
				icon={Moon}
				title="Темная тема"
				stories={data.stories.darkStories}
				authors={data.authors}
			/>
			<Category
				icon={Sun}
				title="Светлая тема"
				stories={data.stories.lightStories}
				authors={data.authors}
			/>
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
