<script lang="ts">
	import { ArchiveBox, CheckCircle, Clock } from 'svelte-heros-v2';
	import { Icon } from 'treetale-ui';

	import ProfileLink from './StoryCard/ProfileLink.svelte';

	import type { RGB, StoryStatus, User } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { formatDate } from '$lib/utils/date';

	let {
		author,
		class: classname,
		created,
		edit,
		mobileView,
		status
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
	let date = $derived(formatDate(created));
</script>

{#if author && !edit}
	<ProfileLink {author} class={classname} {mobileView} />
{:else}
	<div
		class={clm('flex items-center overflow-hidden p-1 text-sm', currentStatus.color, classname)}
	>
		<Icon
			class={clm('box-content size-8 shrink-0 p-1', mobileView && 'max-sm:size-6')}
			this={currentStatus.icon}
		/>
		<div
			class={clm('ml-2 mr-5 overflow-hidden text-left text-text', mobileView && 'max-md:hidden')}
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
