<script lang="ts">
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { Heart } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import { addLike } from '$lib/requests/story';

	import Icon from './Icon.svelte';

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
	{loading}
	on:click={handleClick}
	size="lg"
	variant="ghost"
>
	<Icon
		class={clsx('size-6', isLiked && 'text-red-500')}
		type={Heart}
		variation={isLiked ? 'solid' : 'outline'}
	/>
	<p class="min-w-[1rem]">{likes.length}</p>
</Button>
