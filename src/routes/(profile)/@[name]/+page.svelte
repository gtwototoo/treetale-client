<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils/text.js';
	import { Button } from '$UI';

	export let data;
</script>

<StoriesList stories={data.stories} authors={data.authors}>
	<p>
		{correctWhitespace('У данного пользователя пока нету ни одной опубликованной истории')}
	</p>
	<Link href="/">
		<Button size="lg" class="bg-contrast text-text" variant="ghost">Смотреть все истории</Button>
	</Link>
</StoriesList>
