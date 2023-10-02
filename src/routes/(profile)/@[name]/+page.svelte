<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { Button } from '$UI';

	export let data;
</script>

<StoriesList
	stories={data.stories}
	text="У данного пользователя пока нету ни одной опубликованной истории"
>
	<Link href="/">
		<Button size="lg" class="bg-contrast text-text" variant="ghost">Смотреть все истории</Button>
	</Link>
</StoriesList>
