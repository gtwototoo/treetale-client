<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import { createStory } from '$lib/requests/story';
	import { Button } from '$UI';
	import { Plus } from 'svelte-heros-v2';

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

<Button class="bg-emerald-500" variant="main" on:click={handleClick} {loading}>
	<Icon type={Plus} />
	<p>Добавить историю</p>
</Button>
