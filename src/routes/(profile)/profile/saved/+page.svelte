<script lang="ts">
	import { Button } from 'treetale-ui';

	import StoriesList from '$lib/components/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils/text';

	const { data } = $props();
</script>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace(
			'Пока у вас нет ни одной начатой истории, посмотрите на весь каталог различных историй'
		)}
	</p>

	<Button asLink href="/" class="bg-main-50 text-text hover:bg-main-70" size="lg">
		Смотреть все истории
	</Button>
</StoriesList>
