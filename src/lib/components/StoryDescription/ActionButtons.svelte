<script lang="ts">
	import { onDestroy } from 'svelte';

	import { page } from '$app/stores';
	import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
	import without from 'lodash/without';
	import { pluralize } from 'pluralize-ru-ts';
	import { Clock, DocumentDuplicate, Heart } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import type { Genre } from '$lib/types';

	import { addLike } from '$lib/requests/story';
	import { clm } from '$lib/utils/classMerge';

	type CopyState = 'error' | 'success' | null;

	let {
		genre,
		likes,
		storyId
	}: {
		genre: Genre;
		likes: number[];
		storyId: number;
	} = $props();

	let copyState = $state<CopyState>(null);
	let likeLoading = $state(false);
	let reactiveLikes = $state<number[]>(likes);

	const likesPluralize = pluralize('лайк', 'лайка', 'лайков');

	const copyText = async (value: string): Promise<boolean> => {
		let success = true;

		try {
			await window.navigator.clipboard.writeText(value);
		} catch (e) {
			console.error(e);

			success = true;
		}

		return success;
	};

	const switchLike = async () => {
		likeLoading = true;

		try {
			const response = await addLike(storyId);

			if (response.liked) {
				reactiveLikes.push($page.data.session.userId);
			} else {
				reactiveLikes = without(reactiveLikes, $page.data.session.userId);
			}
		} finally {
			likeLoading = false;
		}
	};

	const handleCopyLink = async () => {
		copyState = (await copyText(textForCopy)) ? 'success' : 'error';
	};

	const handleOpenHistory = () => {
		console.log('open history');
	};

	let textForCopy = $derived(`${PUBLIC_TREETALE_CLIENT_URL}/${storyId}`);
	let isLiked = $derived(reactiveLikes?.includes($page.data.session?.userId));

	$effect(() => {
		if (copyState) {
			const timeout = setTimeout(() => {
				copyState = null;
			}, 500);

			onDestroy(() => {
				clearTimeout(timeout);
			});
		}
	});
</script>

<div
	class="flex gap-2 *:flex-1 *:flex-col *:gap-1 *:overflow-hidden *:bg-main-50 hover:*:bg-main-70"
>
	<Button asLink size="lg" href={`/?genres=${genre.id}`}>
		<svelte:component this={genre.icon} class="size-8" />
		<p>{genre.title}</p>
	</Button>
	<Button size="lg" onclick={handleCopyLink}>
		<Icon
			this={DocumentDuplicate}
			class={clm(
				'size-8 *:stroke-2',
				copyState === 'success' && 'text-green-500',
				copyState === 'error' && 'text-red-500'
			)}
		/>
		<p>Ссылка</p>
	</Button>
	<Button size="lg" onclick={handleOpenHistory}>
		<Icon this={Clock} class="size-8 *:stroke-2" />
		<p>История</p>
	</Button>
	<Button size="lg" onclick={switchLike} loading={likeLoading}>
		<Icon
			class={clm('size-8 *:stroke-2', isLiked && 'text-red-500')}
			this={Heart}
			variation={isLiked ? 'solid' : 'outline'}
		/>
		<p>{reactiveLikes.length} {likesPluralize(reactiveLikes.length)}</p>
	</Button>
</div>
