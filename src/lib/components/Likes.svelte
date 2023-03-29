<script lang="ts">
	import { page } from '$app/stores';
	import { addLike } from '$lib/requests/story';
	import type { IStoryReading } from '$lib/types/reading';
	import { Button } from '$UI';
	import clsx from 'clsx';
	import { Heart } from 'svelte-heros-v2';
	import Icon from './Icon.svelte';

	export let info: IStoryReading;

	let process = false;
	let likes = info.likes;
	let liked = likes.includes($page.data.session?.userId);

	const handleClick = async () => {
		process = true;

		const { error, response } = await addLike(info.storyId);

		process = false;

		if (error) return;

		if (response.liked) {
			likes = [...likes, $page.data.session.userId];
		} else {
			likes = likes.filter((id) => id !== $page.data.session.userId);
		}

		liked = likes.includes($page.data.session.userId);
	};
</script>

<Button
	class="gap-1 !p-1 xs:!p-2"
	variant="transparent"
	on:click={handleClick}
	disabled={process || !$page.data.session}
>
	<Icon
		type={Heart}
		variation={liked ? 'solid' : undefined}
		class={clsx({
			'text-red-600': liked
		})}
	/>
	<p class="min-w-[1rem]">{likes.length}</p>
</Button>
