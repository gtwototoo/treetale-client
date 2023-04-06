<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { createStory } from '$lib/requests/story';
	import { currentPanel } from '$lib/stores/main';
	import { Button } from '$UI';
	import { onDestroy } from 'svelte';
	import { Plus } from 'svelte-heros-v2';

	export let data;

	let loading = false;

	const handleClick = async () => {
		loading = true;

		if ($page.data.session) {
			await createStory();
		} else {
			await goto('/signin');
		}

		loading = false;
	};

	onDestroy(() => {
		currentPanel.clear();
	});
</script>

<svelte:head>
	<title>Профиль</title>
</svelte:head>

<StoriesList
	stories={data.stories}
	text="Пока у вас нет ни одной созданной истории, добавьте свою уникальную историю"
>
	<Button size="lg" class="gap-4" variant="secondaryWhite" on:click={handleClick} {loading}>
		<Icon type={Plus} />
		<p>Добавить историю</p>
	</Button>
</StoriesList>
