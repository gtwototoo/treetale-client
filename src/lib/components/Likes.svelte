<script lang="ts">
	import { page } from '$app/stores';

	import without from 'lodash/without';
	import { Heart } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { addLike } from '$lib/requests/story';
	import { clm } from '$lib/utils/classMerge';

	let {
		class: classname,
		likes,
		storyId
	}: {
		class?: string;
		likes: number[];
		storyId: number;
	} = $props();

	let loading = $state(false);

	const handleClick = async () => {
		loading = true;

		try {
			const { message } = await addLike(storyId);

			if (message.liked) {
				likes = [...likes, $page.data.session.userId];
			} else {
				likes = without(likes, $page.data.session.userId);
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	let isLiked = $derived(likes?.includes($page.data.session?.userId));
</script>

<Button
	class={clm('gap-2 bg-main-50 px-3 text-text hover:bg-main-70 hover:text-red-500', classname)}
	{loading}
	onclick={handleClick}
	size="lg"
>
	<Icon
		class={clm('size-6 *:stroke-2', isLiked && 'text-red-500')}
		this={Heart}
		variation={isLiked ? 'solid' : 'outline'}
	/>
	<p class="min-w-[1rem]">{likes.length}</p>
</Button>
