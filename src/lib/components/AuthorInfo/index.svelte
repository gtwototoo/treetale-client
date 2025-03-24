<script lang="ts">
	import { ArchiveBox, Check, Clock } from 'svelte-heros-v2';
	import { Icon } from 'treetale-ui';

	import type { RGB, StoryStatus, User } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { formatDate } from '$lib/utils/date';

	import UserBadge from './UserBadge.svelte';

	const {
		author,
		class: classname,
		created,
		edit,
		mobileView,
		status,
		isButton
	}: {
		author?: {
			subscribersCount: number;
		} & User;
		class?: string;
		created: number;
		edit: boolean;
		mobileView?: boolean;
		selectedColor: RGB;
		status: StoryStatus;
		isButton?: boolean;
	} = $props();

	const statuses = {
		draft: {
			color: clm('bg-gray-500/20 ring-gray-500/50 text-gray-500'),
			icon: ArchiveBox,
			title: 'Черновик'
		},
		archived: {
			color: clm('bg-gray-500/20 ring-gray-500/50 text-gray-500'),
			icon: ArchiveBox,
			title: 'Архив'
		},
		published: {
			color: clm('bg-emerald-500/20 ring-emerald-500/50 text-emerald-500'),
			icon: Check,
			title: 'Опубликовано'
		},
		review: {
			color: clm('bg-orange-500/20 ring-orange-500/50 text-orange-500'),
			icon: Clock,
			title: 'На проверке'
		}
	};

	const currentStatus = $derived(statuses[status]);
	const date = $derived(formatDate(created));
</script>

{#if author && !edit}
	<UserBadge {author} class={classname} {mobileView} {isButton} />
{:else}
	<div class={clm('flex items-center overflow-hidden p-1 text-sm', classname)}>
		<div
			class={clm(
				'flex size-10 items-center justify-center rounded-full ring-1',
				currentStatus.color
			)}
		>
			<Icon class="box-content size-6 shrink-0 *:stroke-2" this={currentStatus.icon} />
		</div>
		<div
			class={clm('text-text mr-5 ml-2 overflow-hidden text-left', mobileView && 'max-md:hidden')}
		>
			<p class="truncate text-base/5 font-medium">
				{currentStatus.title}
			</p>
			<p class="truncate text-xs">
				{date}
			</p>
		</div>
	</div>
{/if}
