<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import { pluralize } from 'pluralize-ru-ts';
	import { Trash } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { deleteProgress } from '$lib/requests/progress';
	import type { Frame, Story } from '$lib/types';
	import type { ResponseProgress } from '$lib/types/response';
	import { clm } from '$lib/utils/classMerge';
	import { contrastText } from '$lib/utils/contrast';
	import { formatDate } from '$lib/utils/date';

	import FrameMini from '../FrameMini.svelte';
	import VersionTag from '../VersionTag.svelte';

	const {
		progress,
		lastFrame,
		story,
		ondelete
	}: {
		progress: ResponseProgress['progress'];
		lastFrame: Frame;
		story: Story;
		ondelete?: () => void;
	} = $props();

	let loading = $state(false);

	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');
	const doPluralize = pluralize('Сделан', 'Сделано', 'Сделано');

	const handleDelete = async () => {
		loading = true;

		try {
			await deleteProgress(story.storyId);
			await invalidateAll();
		} catch (error) {
			console.error(error);
		}

		loading = false;

		ondelete?.();
	};

	const { choices, version, updated } = $derived(progress);
	const choicesCount = $derived(choices.length);
	const redBackgroundColor = $derived(
		contrastText(story.color)
			? clm('bg-red-900 hover:bg-red-800 text-red-500')
			: clm('bg-red-100 hover:bg-red-200 text-red-500')
	);
</script>

<div class="flex w-full flex-col gap-6">
	<div class="flex items-center gap-3 max-md:justify-between max-md:px-3">
		<VersionTag
			currentVersion={story.version}
			progressVersion={version}
			displayVersion="progress"
		/>
		<p class="italic">
			{doPluralize(choicesCount)}
			<span class="font-medium">{choicesCount}</span>
			{choicesPluralize(choicesCount)}
		</p>
	</div>
	<FrameMini frame={lastFrame} />
	<div class="flex justify-between">
		<div class="flex items-center gap-3 overflow-hidden">
			<Button
				class={clm(redBackgroundColor, 'pointer-events-auto justify-center px-2.5 py-1')}
				onclick={handleDelete}
				{loading}
			>
				<Icon this={Trash} class="size-5" />
			</Button>
			<div class="flex flex-col overflow-hidden text-sm">
				<p class="truncate">Дата прохождения:</p>
				<p>{formatDate(updated!)}</p>
			</div>
		</div>
		<Button
			asLink
			size="lg"
			href="/{story.storyId}"
			class="adaptive-font bg-main-700 hover:bg-main pointer-events-auto font-medium"
		>
			Продолжить
		</Button>
	</div>
</div>
