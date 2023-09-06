<script lang="ts">
	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { createStory } from '$lib/requests/story';
	import { Plus } from 'svelte-heros-v2';
	import Header from './Header.svelte';

	let loading = false;

	const handleClick = async () => {
		loading = true;

		await createStory();

		loading = false;
	};
</script>

<Header>
	<Button
		class="header-button bg-emerald-400 text-text"
		variant="ghost"
		on:click={handleClick}
		{loading}
		size="lg"
	>
		<Icon type={Plus} class="w-6 h-6" />
		<p class="mr-1">Добавить историю</p>
	</Button>
</Header>
