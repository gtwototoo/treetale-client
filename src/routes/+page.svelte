<script lang="ts">
	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { DEFAULT_COLOR } from '$lib/constants.js';
	import { bodyColorStore } from '$lib/stores/main';
	import { rootStyle } from '$lib/utils';

	export let data;

	$bodyColorStore = DEFAULT_COLOR;
</script>

<svelte:head>
	<title>TreeStory</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<div class="flex grow flex-col">
	<h1 class="sticky top-0 z-[1] w-full select-none py-4 text-center leading-9 text-text">
		Список историй
	</h1>
	<StoriesList
		stories={data.stories}
		text="Историй не найдено, но вы можете добавить свою уникальную историю"
	>
		<AddStoryButton class="gap-3 bg-white" />
	</StoriesList>
</div>
