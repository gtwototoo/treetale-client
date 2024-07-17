<script lang="ts">
	import { Button, Link } from 'treetale-ui';

	import StoriesList from '$lib/components/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils/text.js';

	let { data } = $props();
</script>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace('У данного пользователя пока нету ни одной опубликованной истории')}
	</p>
	<Link href="/">
		<Button class="bg-main-40 text-text hover:bg-contrast" size="lg">Смотреть все истории</Button>
	</Link>
</StoriesList>
