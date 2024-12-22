<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { MouseEventHandler } from 'svelte/elements';

	import { pluralize } from 'pluralize-ru-ts';
	import { Trash } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { deleteProgress } from '$lib/requests/progress';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { Frame } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { formatDate } from '$lib/utils/date';

	import FrameMini from '../FrameMini.svelte';
	import VersionTag from '../VersionTag.svelte';

	import CopyButton from './CopyButton.svelte';

	const {
		choicesCount,
		currentVersion,
		lastFrame,
		onclick,
		progressVersion,
		storyId,
		updated
	}: {
		choicesCount: number;
		currentVersion: string;
		lastFrame: Frame;
		onclick: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
		progressVersion: string;
		storyId: number;
		updated: number;
	} = $props();

	let loading = $state(false);

	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');
	const doPluralize = pluralize('Сделан', 'Сделано', 'Сделано');

	const handleDelete = async () => {
		loading = true;

		try {
			await deleteProgress(storyId);

			await invalidateAll();
		} catch (error) {
			console.error(error);
		}

		loading = false;
	};
</script>

<div class="flex w-full flex-col gap-6">
	<div class="flex items-center gap-3 max-md:justify-between max-md:px-3">
		<VersionTag {currentVersion} {progressVersion} displayVersion="progress" />
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
				class={clm(
					redBackgroundColorStore.color,
					'pointer-events-auto justify-center px-2.5 py-1 text-red-500'
				)}
				onclick={handleDelete}
				{loading}
			>
				<Icon this={Trash} class="size-5" />
			</Button>
			<div class="flex flex-col overflow-hidden text-sm">
				<p class="truncate">Дата прохождения:</p>
				<p>{formatDate(updated)}</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<CopyButton {storyId} class="max-xs:hidden" />
			<Button
				size="lg"
				class="adaptive-font pointer-events-auto bg-main-70 font-medium hover:bg-main"
				{onclick}
			>
				Продолжить
			</Button>
		</div>
	</div>
</div>
