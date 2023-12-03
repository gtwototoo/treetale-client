<script lang="ts">
	import { MagnifyingGlass, Moon, RocketLaunch, Sun } from 'svelte-heros-v2';

	import { Input } from '$UI';
	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Category from '$lib/components/modules/Category.svelte';
	import { DEFAULT_COLOR } from '$lib/constants.js';
	import { bodyColorStore } from '$lib/stores/main';
	import { correctWhitespace, rootStyle } from '$lib/utils';

	export let data;

	$bodyColorStore = DEFAULT_COLOR;
</script>

<svelte:head>
	<title>TREETALE</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<div class="flex grow flex-col gap-4">
	{#if Object.keys(data.stories).length}
		<div class="flex w-full flex-col items-center gap-4 px-2">
			<h1 class="sticky top-0 z-[1] w-full select-none py-4 text-center leading-9 text-text">
				Список историй
			</h1>
			<Input placeholder="Поиск" size="lg" class="w-full max-w-lg">
				<svelte:fragment slot="left">
					<Icon
						type={MagnifyingGlass}
						class="pointer-events-none mr-5 h-6 w-6 text-gray-800"
					/>
				</svelte:fragment>
			</Input>
		</div>
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
	{:else}
		<div class="plug flex-grow gap-8">
			<p>
				{correctWhitespace('Историй не найдено, но вы можете добавить свою уникальную историю')}
			</p>
			<AddStoryButton class="gap-3 bg-white" />
		</div>
	{/if}
</div>
