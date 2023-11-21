<script lang="ts">
	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { correctWhitespace } from '$lib/utils/text.js';

	export let data;
</script>

<svelte:head>
	<title>Профиль</title>
</svelte:head>

<StoriesList stories={data.stories}>
	<p>
		{correctWhitespace(
			'Пока у вас нет ни одной созданной истории, добавьте свою уникальную историю'
		)}
	</p>
	<AddStoryButton class="gap-3 bg-contrast text-text" />
</StoriesList>
