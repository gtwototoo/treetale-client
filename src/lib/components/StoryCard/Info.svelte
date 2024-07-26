<script lang="ts">
	import { ArchiveBox, CheckCircle, Clock } from 'svelte-heros-v2';
	import { Icon } from 'treetale-ui';

	import type { RGB, StoryStatus, User } from '$lib/types';

	import { clm } from '$lib/utils/classMerge';
	import { contrastText } from '$lib/utils/contrast';
	import { formatDate } from '$lib/utils/date';

	import ProfileLink from './ProfileLink.svelte';

	let {
		author,
		class: classname,
		created,
		edit,
		selectedColor,
		status
	}: {
		author?: {
			subscribersCount: number;
		} & User;
		class?: string;
		created: number;
		edit: boolean;
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
	let infoBackgroundColor = $derived(
		contrastText(selectedColor)
			? clm('bg-main-30 hover:bg-main-50')
			: clm('bg-main-60 hover:bg-main-70')
	);
</script>

<div class={classname}>
	{#if author && !edit}
		<ProfileLink {author} class={clm('w-full', infoBackgroundColor)} />
	{:else}
		<div
			class={clm(
				'flex items-center overflow-hidden rounded-full rounded-br-none p-1 text-sm',
				currentStatus.color,
				infoBackgroundColor
			)}
		>
			<Icon class="box-content size-8 shrink-0 p-1 max-sm:size-6" this={currentStatus.icon} />
			<div class="ml-2 mr-5 overflow-hidden text-left text-text max-md:hidden">
				<p class="truncate text-base/5 font-medium max-xs:hidden">
					{currentStatus.title}
				</p>
				<p class="truncate text-xs">
					{date}
				</p>
			</div>
		</div>
	{/if}
</div>
