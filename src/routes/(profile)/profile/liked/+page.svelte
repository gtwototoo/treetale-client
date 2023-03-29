<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { storiesStore } from '$lib/stores/profile';
	import { Button } from '$UI';
	import { Plus } from 'svelte-heros-v2';

	export let data;
</script>

<StoriesList
	stories={$storiesStore}
	text="Пока у вас нет ни одной понравившейся истории, но вы можете их добавить"
>
	<Link href="/">
		<Button size="big" class="gap-4" variant="secondaryWhite">
			<Icon type={Plus} />
			<p>Смотреть все истории</p>
		</Button>
	</Link>
</StoriesList>
