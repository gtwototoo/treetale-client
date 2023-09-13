<script lang="ts">
	import { Button } from '$UI';
	import { page } from '$app/stores';
	import { addLike } from '$lib/requests/story';
	import type { IStoryReading } from '$lib/types/reading';
	import clsx from 'clsx';
	import { Heart } from 'svelte-heros-v2';
	import Icon from './Icon.svelte';

	export let info: IStoryReading;

	let loading = false;
	let likes = info.likes;
	let liked = likes.includes($page.data.session?.userId);

	const handleClick = async () => {
		loading = true;

		try {
			const response = await addLike(info.storyId);

			if (response.liked) {
				likes = [...likes, $page.data.session.userId];
			} else {
				likes = likes.filter((id) => id !== $page.data.session.userId);
			}

			liked = likes.includes($page.data.session.userId);
		} finally {
			loading = false;
		}
	};
</script>

<Button class="gap-2 !px-3 hover:!text-red-600" variant="secondary" on:click={handleClick}>
	<Icon
		type={Heart}
		variation={liked ? 'solid' : undefined}
		class={clsx('h-6 w-6', liked && 'text-red-600')}
	/>
	<p class="min-w-[1rem]">{likes.length}</p>
</Button>
