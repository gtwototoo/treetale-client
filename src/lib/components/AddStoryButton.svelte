<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { Plus } from 'svelte-heros-v2';

	import { createStory } from '$lib/requests/story';
	import { Button } from '$UI';

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
	{loading}
	on:click={handleClick}
	size="lg"
	variant="ghost"
>
	<Icon class="h-6 w-6" type={Plus} />
	<p class="mr-1">Добавить историю</p>
</Button>
