<script lang="ts">
	import { page } from '$app/stores';
	import { addLike } from '$lib/requests/story';
	import { clm } from '$lib/utils/classMerge';
	import without from 'lodash/without';
	import { Heart } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	let {
		likes,
		storyId
	}: {
		likes: number[];
		storyId: number;
	} = $props();

	let loading = $state(false);

	const handleClick = async () => {
		loading = true;

		try {
			const response = await addLike(storyId);

			if (response.liked) {
				likes = [...likes, $page.data.session.userId];
			} else {
				likes = without(likes, $page.data.session.userId);
			}

			isLiked = likes.includes($page.data.session.userId);
		} finally {
			loading = false;
		}
	};

	let isLiked = $derived(likes?.includes($page.data.session?.userId));
</script>

<Button
	class="gap-2 bg-main !px-3 text-text hover:text-red-500"
	{loading}
	onclick={handleClick}
	size="lg"
>
	<Icon
		class={clm('size-6', isLiked && 'text-red-500')}
		this={Heart}
		variation={isLiked ? 'solid' : 'outline'}
	/>
	<p class="min-w-[1rem]">{likes.length}</p>
</Button>
