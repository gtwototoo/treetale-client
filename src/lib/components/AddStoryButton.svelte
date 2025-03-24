<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import { PlusCircle } from 'svelte-heros-v2';

	import { createStory } from '$lib/requests/story';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	const {
		class: classname
	}: {
		class?: string;
	} = $props();

	let loading = $state(false);

	const handleClick = async () => {
		if (!page.data.session) {
			await goto('/signin');
		}

		loading = true;

		try {
			const { message } = await createStory();

			await goto(`/board/${message.storyId}`);
		} catch (error) {
			console.error(error);
		}

		loading = false;
	};
</script>

<Button
	class={clm(button.type.primary, button.size.lg, 'gap-3 pl-4', classname)}
	{loading}
	onclick={handleClick}
>
	<Icon class="size-6" this={PlusCircle} />
	<p class="mr-1">Добавить историю</p>
</Button>
