<script lang="ts">
	import clsx from 'clsx';
	import { Heart } from 'svelte-heros-v2';

	import Icon from './Icon.svelte';

	import { page } from '$app/stores';
	import { addLike } from '$lib/requests/story';
	import { Button } from '$UI';

	export let likes: Array<number>;
	export let storyId: number;

	let loading = false;

	$: isLiked = likes.includes($page.data.session?.userId);

	const handleClick = async () => {
		loading = true;

		try {
			const response = await addLike(storyId);

			if (response.liked) {
				likes = [...likes, $page.data.session.userId];
			} else {
				likes = likes.filter((id) => id !== $page.data.session.userId);
			}

			isLiked = likes.includes($page.data.session.userId);
		} finally {
			loading = false;
		}
	};
</script>

<Button
	class="gap-2 bg-main !px-3 text-text hover:text-red-500"
	variant="ghost"
	size="lg"
	on:click={handleClick}
	{loading}
>
	<Icon
		type={Heart}
		variation={isLiked ? 'solid' : 'outline'}
		class={clsx('h-6 w-6', isLiked && 'text-red-500')}
	/>
	<p class="min-w-[1rem]">{likes.length}</p>
</Button>
