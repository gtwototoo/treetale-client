<script lang="ts">
	import { page } from '$app/stores';
	import { ArchiveBox, CheckCircle, Clock, Heart } from 'svelte-heros-v2';

	import type { RGB, StoryStatus, User } from '$lib/types';

	import Likes from '$lib/components/Likes.svelte';

	import { clm } from '$lib/utils/classMerge';
	import { contrastText } from '$lib/utils/contrast';
	import { Icon } from 'treetale-ui';
	import ProfileLink from './ProfileLink.svelte';

	let {
		class: classname,
		status,
		likes,
		author,
		created,
		edit,
		storyId,
		selectedColor
	}: {
		class?: string;
		status: StoryStatus;
		likes: number[];
		author?: User;
		created: number;
		edit: boolean;
		storyId?: number;
		selectedColor: RGB;
	} = $props();

	const statuses = {
		draft: {
			color: 'text-gray-500',
			icon: ArchiveBox,
			title: 'Черновик'
		},
		published: {
			color: 'text-emerald-500',
			icon: CheckCircle,
			title: 'Опубликовано'
		},
		review: {
			color: 'text-orange-500',
			icon: Clock,
			title: 'На проверке'
		}
	};

	let currentStatus = $derived(statuses[status]);
	let isLiked = $derived(likes?.includes($page.data.session?.userId));
	let date = $derived(new Date(created).toLocaleDateString('en-GB'));
	let infoBackgroundColor = $derived(
		contrastText(selectedColor) ? clm('bg-main-30') : clm('bg-main-80')
	);
</script>

<div
	class={clm('bottom-0 flex w-full items-center justify-between gap-4 bg-transparent', classname)}
>
	{#if author && !edit}
		<ProfileLink {author} {created} infoColor={infoBackgroundColor} />
	{:else}
		<div
			class={clm(
				'flex items-center overflow-hidden rounded-full p-1 text-sm',
				currentStatus.color,
				infoBackgroundColor
			)}
		>
			<Icon
				class="box-content size-8 shrink-0 px-2 py-1 max-md:px-1"
				this={currentStatus.icon}
			/>
			<div class="overflow-hidden bg-transparent pr-4 text-left max-md:hidden">
				<p class="truncate text-text max-xs:hidden">
					{currentStatus.title}
				</p>
				<p class="truncate text-xs text-gray-500">
					{date}
				</p>
			</div>
		</div>
	{/if}
	{#if storyId !== undefined && $page.data.session}
		<Likes {likes} {storyId} />
	{:else}
		<div class="mr-4 flex items-center gap-1 text-text">
			<Icon
				class={clm('size-6', isLiked && 'text-red-500')}
				this={Heart}
				variation={isLiked ? 'solid' : undefined}
			/>
			<p class="min-w-[1rem] text-center text-base">{likes.length}</p>
		</div>
	{/if}
</div>
