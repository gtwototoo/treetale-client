<script lang="ts">
	import AddStoryButton from '$lib/components/AddStoryButton.svelte';
	import StoriesList from '$lib/components/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils';

	export let data;
</script>

<svelte:head>
	<title>Профиль</title>
</svelte:head>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace(
			'Пока у вас нет ни одной созданной истории, добавьте свою уникальную историю'
		)}
	</p>
	<AddStoryButton class="gap-3 bg-contrast text-text" />
</StoriesList>
