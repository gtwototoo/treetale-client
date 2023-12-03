<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { correctWhitespace } from '$lib/utils/text.js';
	import { Button } from '$UI';

	export let data;
</script>

<StoriesList stories={data.stories} authors={data.authors}>
	<p>
		{correctWhitespace(
			'Пока у вас нет ни одной начатой истории, посмотрите на весь каталог различных историй'
		)}
	</p>
	<Link href="/">
		<Button size="lg" class="bg-contrast text-text" variant="ghost">Смотреть все истории</Button>
	</Link>
</StoriesList>
