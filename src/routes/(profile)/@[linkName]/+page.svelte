<script lang="ts">
	import StoriesList from '$lib/components/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils/text';

	import CheckStoriesButton from '../CheckStoriesButton.svelte';

	const { data } = $props();
</script>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace('У данного пользователя пока нету ни одной опубликованной истории')}
	</p>
	<CheckStoriesButton />
</StoriesList>
