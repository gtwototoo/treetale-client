<script lang="ts">
	import StoriesList from '$lib/components/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils/text.js';
	import { Button, Link } from 'treetale-ui';

	let { data } = $props();
</script>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace(
			'Пока у вас нет ни одной начатой истории, посмотрите на весь каталог различных историй'
		)}
	</p>
	<Link href="/">
		<Button class="bg-contrast text-text" size="lg">Смотреть все истории</Button>
	</Link>
</StoriesList>
