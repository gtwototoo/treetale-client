<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Link from '$lib/components/Link.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { storiesStore, userStore } from '$lib/stores/profile';
	import { Button } from '$UI';
	import { Plus } from 'svelte-heros-v2';
</script>

<svelte:head>
	<title>{$userStore.name}</title>
</svelte:head>

<StoriesList
	stories={$storiesStore}
	text="У данного пользователя пока нету ни одной опубликованной истории"
>
	<Link href="/">
		<Button size="xl" class="gap-4" variant="secondaryWhite">
			<Icon type={Plus} />
			<p>Смотреть все истории</p>
		</Button>
	</Link>
</StoriesList>
