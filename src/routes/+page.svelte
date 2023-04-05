<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Main from '$lib/components/modules/Header/Main.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { createStory } from '$lib/requests/story';
	import { currentHeader } from '$lib/stores/main';
	import { Button } from '$UI';
	import { Plus } from 'svelte-heros-v2';

	$currentHeader = Main;

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
</script>

<svelte:head>
	<title>TreeStory</title>
</svelte:head>

<div class="flex grow flex-col">
	<h1 class="sticky top-0 z-[1] w-full select-none py-4 text-center leading-9 text-text">
		Список историй
	</h1>
	<StoriesList
		stories={data.stories}
		text="Историй не найдено, но вы можете добавить свою уникальную историю"
	>
		<Button size="lg" class="gap-4" variant="secondaryWhite" on:click={handleClick} {loading}>
			<Icon type={Plus} />
			<p>Добавить историю</p>
		</Button>
	</StoriesList>
</div>
