<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Plus } from 'svelte-heros-v2';

	import { createStory } from '$lib/requests/story';

	import { clm } from '$lib/utils/classMerge';
	import { Button, Icon } from 'treetale-ui';

	let {
		class: classname
	}: {
		class?: string;
	} = $props();

	let loading = $state(false);

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

<Button class={clm('text-text', classname)} {loading} onclick={handleClick} size="lg">
	<Icon class="size-6" this={Plus} />
	<p class="mr-1">Добавить историю</p>
</Button>
