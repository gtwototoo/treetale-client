<script lang="ts">
	import { Button } from '$UI';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createStory } from '$lib/requests/story';
	import clsx from 'clsx';
	import { Plus } from 'svelte-heros-v2';
	import Icon from './Icon.svelte';

	let className = '';
	export { className as class };

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

<Button
	class={clsx('text-text', className)}
	variant="ghost"
	on:click={handleClick}
	{loading}
	size="lg"
>
	<Icon type={Plus} class="w-6 h-6" />
	<p class="mr-1">Добавить историю</p>
</Button>
