<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import { invalidateAll } from '$app/navigation';
	import { pluralize } from 'pluralize-ru-ts';
	import { Trash } from 'svelte-heros-v2';
	import { Button, Icon, Tag } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import { deleteProgress } from '$lib/requests/progress';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { formatDate } from '$lib/utils/date';
	import { versionCompare } from '$lib/utils/versionCompare';

	import FrameMini from '../FrameMini.svelte';
	import CopyButton from './CopyButton.svelte';

	let {
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
		<Tag
			class={clm(
				'bg-opacity-30',
				{
					archived: 'bg-gray-100 text-gray-500',
					breaking: 'bg-red-100 text-red-500',
					current: 'bg-green-100 text-green-500',
					minor: 'bg-yellow-100 text-yellow-500'
				}[versionCompare(currentVersion, progressVersion)]
			)}
		>
			Версия {progressVersion}
		</Tag>
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
					redBackgroundColorStore.color,
					'pointer-events-auto justify-center px-2.5 py-1 text-red-500'
				)}
				onclick={handleDelete}
				{loading}
			>
				<Icon this={Trash} class="size-5" />
			</Button>
			<div class="flex flex-col text-sm">
				<p>Дата прохождения:</p>
				<p>{formatDate(updated)}</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<CopyButton {storyId} />
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
