<script lang="ts">
	import { page } from '$app/state';

	import without from 'lodash/without';
	import { Heart } from 'svelte-heros-v2';

	import { addLike } from '$lib/requests/story';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	const {
		class: classname,
		likes,
		storyId
	}: {
		class?: string;
		likes: number[];
		storyId: number;
	} = $props();

	let loading = $state(false);
	let likesState = $state(likes);

	const handleClick = async () => {
		loading = true;

		try {
			const { message } = await addLike(storyId);

			if (message.liked) {
				likesState = [...likesState, page.data.session.userId];
			} else {
				likesState = without(likesState, page.data.session.userId);
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	const isLiked = $derived(likesState?.includes(page.data.session?.userId));
</script>

<Button
	class={clm(
		button.type.primary,
		button.size.lg,
		'gap-2 bg-red-500/10 py-2 !pl-2 ring-red-500/30 hover:bg-red-500/20',
		classname
	)}
	{loading}
	onclick={handleClick}
>
	<Icon class={clm('size-8 text-red-500')} this={Heart} variation={isLiked ? 'solid' : 'outline'} />
	<p>{likesState.length}</p>
</Button>
