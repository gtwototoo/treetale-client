<script lang="ts">
	import { Button } from '$UI';
	import Link from '$lib/components/Link.svelte';
	import StoriesList from '$lib/components/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils';

	export let data;
</script>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace(
			'Пока у вас нет ни одной начатой истории, посмотрите на весь каталог различных историй'
		)}
	</p>
	<Link href="/">
		<Button class="bg-contrast text-text" size="lg" variant="ghost">Смотреть все истории</Button>
	</Link>
</StoriesList>
