<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import { pluralize } from 'pluralize-ru-ts';
	import { Trash } from 'svelte-heros-v2';

	import { deleteProgress } from '$lib/requests/progress';
	import { theme } from '$lib/stores/colors.svelte';
	import type { Frame, Story } from '$lib/types';
	import type { ResponseProgress } from '$lib/types/response';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
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
		theme.type === 'dark'
			? clm('bg-red-900 hover:bg-red-800 text-red-500 ring-red-700')
			: clm('bg-red-100 hover:bg-red-200 text-red-500 ring-red-300')
	);
</script>

<div class="flex w-full flex-col gap-3">
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
		<div class="flex items-center gap-3">
			<Button
				class={clm(
					button.type.primary,
					button.size.base,
					'adaptive-font p-2.5',
					redBackgroundColor
				)}
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
			href="/{story.storyId}"
			class={clm(button.type.primary, button.size.lg, 'adaptive-font')}
		>
			Продолжить
		</Button>
	</div>
</div>
