<script lang="ts">
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { ArchiveBox, CheckCircle, Clock, Heart } from 'svelte-heros-v2';

	import type { IUser, TRGB, TStoryStatus } from '$lib/types';

	import Icon from '$lib/components/Icon.svelte';
	import Likes from '$lib/components/Likes.svelte';
	import { contrastText } from '$lib/utils';

	import ProfileLink from './ProfileLink.svelte';

	export let status: TStoryStatus;
	export let likes: Array<number>;
	export let author: IUser;
	export let created: number;
	export let edit: boolean;
	export let storyId: number | undefined = undefined;
	export let selectedColor: TRGB;

	let className = '';
	export { className as class };

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

	$: currentStatus = statuses[status];
	$: isLiked = likes?.includes($page.data.session?.userId);
	$: date = new Date(created).toLocaleDateString('en-GB');
	$: infoColor = contrastText(selectedColor) ? clsx('bg-main-30') : clsx('bg-main-80');
</script>

<div
	class={clsx('bottom-0 flex w-full items-center justify-between gap-4 bg-transparent', className)}
>
	{#if author && !edit}
		<ProfileLink {author} {created} {infoColor} />
	{:else}
		<div
			class={clsx(
				'flex items-center overflow-hidden rounded-full p-1 text-sm',
				currentStatus.color,
				infoColor
			)}
		>
			<Icon
				class="box-content size-8 shrink-0 px-2 py-1 max-md:px-1"
				type={currentStatus.icon}
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
				class={clsx('size-6', isLiked && 'text-red-500')}
				type={Heart}
				variation={isLiked ? 'solid' : undefined}
			/>
			<p class="min-w-[1rem] text-center text-base">{likes.length}</p>
		</div>
	{/if}
</div>
