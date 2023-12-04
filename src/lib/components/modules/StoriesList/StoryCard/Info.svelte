<script lang="ts">
	import { FormSplit } from '$UI';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import type { IUser } from '$lib/types';
	import clsx from 'clsx';
	import { ArchiveBox, CheckCircle, Heart } from 'svelte-heros-v2';

	export let draft: boolean;
	export let likes: Array<number>;
	export let author: IUser;
	export let created: number;
	export let tags: Array<string>;
	export let edit: boolean;

	$: isLiked = likes?.includes($page.data.session?.userId);
</script>

<FormSplit vertical class="w-full divide-contrast bg-transparent">
	<div class="flex w-full items-center justify-between gap-4 rounded-xl bg-main-60 p-3">
		{#if author && !edit}
			<ProfileLink {author} {created} />
		{:else}
			<div
				class={clsx(
					'flex items-center gap-2 overflow-hidden text-sm',
					draft ? 'text-gray-500' : 'text-emerald-500'
				)}
			>
				<div class="rounded-full bg-main-30 p-2">
					<Icon type={draft ? ArchiveBox : CheckCircle} class="h-6 w-6" />
				</div>
				<p class="truncate">{draft ? 'Черновик' : 'Опубликовано'}</p>
			</div>
		{/if}
		<div class="mr-1 flex items-center gap-1">
			<Icon
				type={Heart}
				variation={isLiked ? 'solid' : undefined}
				class={clsx('h-6 w-6', isLiked && 'text-red-500')}
			/>
			<p class="min-w-[1rem] text-center text-base">{likes.length}</p>
		</div>
	</div>
	<Tags {tags} />
</FormSplit>
