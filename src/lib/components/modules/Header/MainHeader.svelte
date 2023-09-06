<script lang="ts">
	import { Button } from '$UI';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import { createStory } from '$lib/requests/story';
	import { Plus } from 'svelte-heros-v2';
	import Header from './Header.svelte';

	let loading = false;

	const handleClick = async () => {
		if ($page.data.session) {
			loading = true;

			await createStory();
		} else {
			await goto('/signin');
		}

		loading = false;
	};
</script>

<Header>
	<Button
		class="headerButton bg-emerald-400 text-text"
		variant="ghost"
		on:click={handleClick}
		{loading}
		size="lg"
	>
		<Icon type={Plus} class="w-6 h-6" />
		<p>Добавить историю</p>
	</Button>
</Header>
