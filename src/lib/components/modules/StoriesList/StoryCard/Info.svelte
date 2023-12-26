<script lang="ts">
	import { FormSplit } from '$UI';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import type { IUser, TStoryStatus } from '$lib/types';
	import clsx from 'clsx';
	import { ArchiveBox, CheckCircle, Clock, Heart } from 'svelte-heros-v2';

	export let status: TStoryStatus;
	export let likes: Array<number>;
	export let author: IUser;
	export let created: number;
	export let tags: Array<string>;
	export let edit: boolean;
	export let storyId: number | undefined = undefined;

	const statuses = {
		draft: {
			color: 'text-gray-500',
			icon: ArchiveBox,
			title: 'Черновик'
		},
		review: {
			color: 'text-orange-500',
			icon: Clock,
			title: 'На проверке'
		},
		published: {
			color: 'text-emerald-500',
			icon: CheckCircle,
			title: 'Опубликовано'
		}
	};

	$: currentStatus = statuses[status];
	$: isLiked = likes?.includes($page.data.session?.userId);
</script>

<FormSplit vertical class="w-full divide-contrast bg-transparent">
	<div
		class={clsx(
			'flex w-full items-center justify-between gap-4 rounded-lg bg-main-60 p-3 max-md:p-2',
			storyId === undefined && 'pointer-events-none'
		)}
	>
		{#if author && !edit}
			<ProfileLink {author} {created} />
		{:else}
			<div class={clsx('flex items-center gap-2 overflow-hidden text-sm', currentStatus.color)}>
				<div class="rounded-full bg-main-30 p-1.5">
					<Icon type={currentStatus.icon} class="h-6 w-6" />
				</div>
				<p class="truncate">{currentStatus.title}</p>
			</div>
		{/if}
		{#if storyId !== undefined && $page.data.session}
			<Likes {likes} {storyId} />
		{:else}
			<div class="mr-1 flex items-center gap-1">
				<Icon
					type={Heart}
					variation={isLiked ? 'solid' : undefined}
					class={clsx('h-6 w-6', isLiked && 'text-red-500')}
				/>
				<p class="min-w-[1rem] text-center text-base">{likes.length}</p>
			</div>
		{/if}
	</div>
	<Tags {tags} />
</FormSplit>
