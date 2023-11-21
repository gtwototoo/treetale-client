<script lang="ts">
	import clsx from 'clsx';
	import { Plus } from 'svelte-heros-v2';

	import Icon from './Icon.svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createStory } from '$lib/requests/story';
	import { Button } from '$UI';

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
	<Icon type={Plus} class="h-6 w-6" />
	<p class="mr-1">Добавить историю</p>
</Button>
