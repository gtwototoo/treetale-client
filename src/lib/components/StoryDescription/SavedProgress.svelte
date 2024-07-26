<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	import { invalidateAll } from '$app/navigation';
	import { pluralize } from 'pluralize-ru-ts';
	import { Calendar, Trash } from 'svelte-heros-v2';
	import { Button, Icon, Tag } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import { deleteProgress } from '$lib/requests/progress';
	import { clm } from '$lib/utils/classMerge';
	import { formatDate } from '$lib/utils/date';

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

	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');

	const versionCompare = (a: string, b: string) => {
		if (a === b) return 'current';

		const aVersion = a.split('.');
		const bVersion = b.split('.');

		if (aVersion[0] === bVersion[0]) return 'minor';

		return 'breaking';
	};

	const handleDelete = async () => {
		try {
			await deleteProgress(storyId);

			await invalidateAll();
		} catch (e) {
			console.error(e);
		}
	};
</script>

<div class="flex w-full flex-col gap-3">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<Button size="sm" class="justify-center !bg-red-500 !p-2" onclick={handleDelete}>
				<Icon this={Trash} class="size-4" />
			</Button>
			<p>
				<span class="font-bold">{choicesCount}</span>
				{choicesPluralize(choicesCount)}
			</p>
		</div>
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
	</div>
	<FrameMini frame={lastFrame} />
	<div class="flex justify-between">
		<div class="flex flex-col gap-1 text-sm">
			<div class="flex items-center gap-2">
				<div class="mx-2 size-2 rounded-full bg-yellow-500"></div>
				<p>Прогресс</p>
			</div>
			<div class="flex items-center gap-2">
				<Icon this={Calendar} class="size-6" />
				<p>{formatDate(updated)}</p>
			</div>
		</div>
		<Button size="lg" class="w-48 justify-center bg-main-70 hover:bg-main" {onclick}>
			Продолжить
		</Button>
	</div>
</div>
