<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/StoriesList.svelte';
	import { correctWhitespace } from '$lib/utils';
	import { Button } from '$UI';

	export let data;
</script>

<StoriesList authors={data.authors} stories={data.stories}>
	<p>
		{correctWhitespace('Пока у вас нет ни одной понравившейся истории, но вы можете их добавить')}
	</p>
	<Link href="/">
		<Button class="bg-contrast text-text" size="lg" variant="ghost">Смотреть все истории</Button>
	</Link>
</StoriesList>
