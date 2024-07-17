<script lang="ts">
	import { Button, Link } from 'treetale-ui';

	import StoriesList from '$lib/components/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils/text.js';

	let { data } = $props();
</script>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace(
			'Пока у вас нет ни одной начатой истории, посмотрите на весь каталог различных историй'
		)}
	</p>
	<Link href="/">
		<Button class="bg-main-40 text-text hover:bg-contrast" size="lg">Смотреть все истории</Button>
	</Link>
</StoriesList>
