<script lang="ts">
	import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
	import { onDestroy } from 'svelte';

	import { pluralize } from 'pluralize-ru-ts';
	import { Share } from 'svelte-heros-v2';
	import { Button, Icon, Tag } from 'treetale-ui';

	import type { Frame } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';

	import FrameMini from './FrameMini.svelte';
	import VersionTag from './VersionTag.svelte';

	let {
		choicesCount,
		endFrame,
		progressVersion,
		currentVersion,
		storyId,
		resultId
	}: {
		choicesCount: number;
		endFrame: Frame;
		progressVersion: string;
		currentVersion: string;
		storyId: number;
		resultId: number;
	} = $props();

	type CopyState = 'error' | 'success' | null;

	const doPluralize = pluralize('Сделан', 'Сделано', 'Сделано');
	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');
	const percent = 12;
	const newEnd = true;

	let textForCopy = $derived(`${PUBLIC_TREETALE_CLIENT_URL}/results/${resultId}`);

	let copyState = $state<CopyState>(null);

	const copyText = async (value: string): Promise<boolean> => {
		let success = true;

		try {
			await window.navigator.clipboard.writeText(value);
		} catch (error) {
			console.error(error);

			success = true;
		}

		return success;
	};

	const handleCopyLink = async () => {
		copyState = (await copyText(textForCopy)) ? 'success' : 'error';
	};

	$effect(() => {
		if (copyState) {
			const timeout = setTimeout(() => {
				copyState = null;
			}, 500);

			onDestroy(() => {
				clearTimeout(timeout);
			});
		}
	});
</script>

<div class="flex w-full flex-col gap-3 max-md:items-center">
	<div class="flex *:gap-3 *:rounded-full *:pl-4 hover:*:bg-main-50">
		<Button size="lg" onclick={handleCopyLink} class="pointer-events-auto">
			<Icon
				this={Share}
				class={clm(
					'size-6 *:stroke-2',
					copyState === 'success' && 'text-green-500',
					copyState === 'error' && 'text-red-500'
				)}
			/>
			<p>Поделиться результатом</p>
		</Button>
	</div>
	<h1 class="text-[clamp(32px,5vw,56px)] leading-tight max-md:pb-4">Результаты</h1>
	<div class="flex w-full items-center gap-3 max-md:justify-between max-md:px-3">
		<VersionTag {currentVersion} {progressVersion} displayVersion="progress" />
		<p class="italic">
			{doPluralize(choicesCount)}
			<span class="font-medium">{choicesCount}</span>
			{choicesPluralize(choicesCount)}
		</p>
	</div>
</div>
<div class="flex w-full flex-col gap-4">
	<div class="flex justify-between gap-4">
		<div class="flex gap-2">
			<p>Концовка <span class="font-bold">№{2}</span></p>
			{#if newEnd}
				<Tag class="bg-green-100 bg-opacity-30 text-green-500">Новая</Tag>
			{/if}
		</div>
		<p>Получило <span class="font-bold">{percent}%</span> читателей</p>
	</div>
	<div class="h-4 w-full overflow-hidden rounded-full bg-main-50">
		<div class="h-full bg-main" style:width="{percent}%"></div>
	</div>
</div>
<FrameMini frame={endFrame} />
<div class="flex gap-3 *:pointer-events-auto max-md:w-full *:max-md:flex-1">
	<Button
		asLink
		size="lg"
		class="adaptive-font justify-center bg-main-70 font-medium hover:bg-main"
		href={`/${storyId}`}
	>
		В начало
	</Button>
	<Button
		asLink
		href="/"
		size="lg"
		class="adaptive-font justify-center bg-main-70 font-medium hover:bg-main"
	>
		На главную
	</Button>
</div>
