<script lang="ts">
	import { PUBLIC_TREETALE_CLIENT_URL } from '$env/static/public';
	import { onDestroy } from 'svelte';

	import { pluralize } from 'pluralize-ru-ts';
	import { Share } from 'svelte-heros-v2';

	import FrameMini from '$lib/components/FrameMini.svelte';
	import VersionTag from '$lib/components/VersionTag.svelte';
	import type { Story } from '$lib/types';
	import type { ResponseResults } from '$lib/types/response';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	const {
		story,
		progress
	}: {
		story: Story;
		progress: ResponseResults['progress'];
	} = $props();

	type CopyState = 'error' | 'success' | null;

	let copyState = $state<CopyState>(null);

	const doPluralize = pluralize('Сделан', 'Сделано', 'Сделано');
	const choicesPluralize = pluralize('выбор', 'выбора', 'выборов');

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

	const textForCopy = $derived(`${PUBLIC_TREETALE_CLIENT_URL}/results/${progress.resultId}`);
	const { choices, endFrame, version } = $derived(progress);
	const choicesCount = $derived(choices.length);

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
	<div class="*:bg-main-300 *:hover:bg-main-500 flex *:gap-3 *:rounded-full *:pl-4">
		<Button
			onclick={handleCopyLink}
			class={clm(button.size.lg, button.type.primary, 'pointer-events-auto')}
		>
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
</div>
<FrameMini frame={endFrame!} short={false} />
<div class="flex gap-3 *:pointer-events-auto *:justify-center max-md:w-full *:max-md:flex-1">
	<Button
		asLink
		class={clm(button.size.lg, button.type.primary, 'adaptive-font')}
		href="/{story.storyId}"
	>
		В начало
	</Button>
	<Button asLink href="/" class={clm(button.size.lg, button.type.primary, 'adaptive-font')}>
		На главную
	</Button>
</div>
