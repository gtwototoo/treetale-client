<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { Button } from '$UI';
	import { BookOpen } from 'svelte-heros-v2';

	export let data;
</script>

<StoriesList
	stories={data.stories}
	text="Пока у вас нет ни одной начатой истории, посмотрите на весь каталог различных историй"
>
	<Link href="/">
		<Button size="lg" class="gap-4" variant="secondary-white">
			<Icon type={BookOpen} />
			<p>Смотреть все истории</p>
		</Button>
	</Link>
</StoriesList>
