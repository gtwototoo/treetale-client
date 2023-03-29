<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { createStory } from '$lib/requests/story';
	import { storiesStore } from '$lib/stores/profile';
	import { Button } from '$UI';
	import { Plus } from 'svelte-heros-v2';

	export let data;

	let loading = false;

	storiesStore.set(data.stories);

	const handleClick = async () => {
		loading = true;

		if ($page.data.session) {
			await createStory();
		} else {
			await goto('/signin');
		}

		loading = false;
	};
</script>

<svelte:head>
	<title>Профиль</title>
</svelte:head>

<StoriesList
	stories={$storiesStore}
	text="Пока у вас нет ни одной созданной истории, добавьте свою уникальную историю"
>
	<Button size="xl" class="gap-4" variant="secondaryWhite" on:click={handleClick} {loading}>
		<Icon type={Plus} />
		<p>Добавить историю</p>
	</Button>
</StoriesList>
