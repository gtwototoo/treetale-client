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

	import FrameMini from './FrameMini.svelte';

	let {
		choicesCount,
		lastFrame,
		onclick,
		storyId,
		storyVersion,
		updated,
		version
	}: {
		choicesCount: number;
		lastFrame: Frame;
		onclick: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
		storyId: number;
		storyVersion: string;
		updated: number;
		version: string;
	} = $props();

	let loading = $state(false);

	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');
	const doPluralize = pluralize('Сделан', 'Сделано', 'Сделано');

	const handleDelete = async () => {
		loading = true;

		try {
			await deleteProgress(storyId);

			await invalidateAll();
		} catch (e) {
			console.error(e);
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
					breaking: 'bg-red-100 text-red-500',
					current: 'bg-green-100 text-green-500',
					minor: 'bg-yellow-100 text-yellow-500'
				}[versionCompare(storyVersion, version)]
			)}
		>
			Версия {version}
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
				class={clm(redBackgroundColorStore.color, 'justify-center px-2.5 py-1 text-red-500')}
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
		<Button size="lg" class="adaptive-font bg-main-70 font-medium hover:bg-main" {onclick}>
			Продолжить
		</Button>
	</div>
</div>
