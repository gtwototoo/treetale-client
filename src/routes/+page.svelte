<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import StoriesList from '$lib/components/modules/StoriesList/index.svelte';
	import { DEFAULT_COLOR } from '$lib/constants.js';
	import { createStory } from '$lib/requests/story';
	import { bodyColor } from '$lib/stores/story.js';
	import { rootStyle } from '$lib/utils/custom_colors.js';
	import { Button } from '$UI';
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

	$bodyColor = DEFAULT_COLOR;
</script>

<svelte:head>
	<title>TreeStory</title>
	{@html rootStyle($bodyColor)}
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
