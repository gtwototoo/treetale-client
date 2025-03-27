<script lang="ts">
	import { goto } from '$app/navigation';

	import { setEndProgress } from '$lib/requests/results';
	import { fullscreenStore } from '$lib/stores/reading.svelte';
	import type { Frame } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Image from '$lib/ui/Image.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { correctWhitespace } from '$lib/utils/text';

	import { enabledChoice } from '../methods.svelte';

	import InterfaceViewButton from './InterfaceViewButton.svelte';
	import Choice from './ReadFrame/Choice.svelte';

	const {
		lastFrame,
		storyId,
		progressId
	}: {
		lastFrame: Frame;
		storyId: number;
		progressId: number;
	} = $props();

	let loading = $state(false);

	const handleEndStory = async () => {
		loading = true;

		try {
			const { message } = await setEndProgress(progressId);

			// Результат будет скорее всего в отдельном разделе бд, там должна быть скорее всего статика данных (% прошедших и т.д., кроме версии)
			await goto(`/results/${message.resultId}`);
		} catch (error) {
			console.error(error);
		}

		loading = false;
	};

	const availableChoicesCount = $derived(
		lastFrame.choices.filter((choice) => enabledChoice(lastFrame.modificators, choice)).length
	);
</script>

<div class="pointer-events-none size-full">
	<InterfaceViewButton />
	{#if lastFrame.imageUrl}
		<Image alt="Иллюстрация" class="text-text size-full" cover src={lastFrame.imageUrl} />
	{/if}
	<div
		class={clm(
			'absolute bottom-0 flex w-full justify-center p-6 max-md:p-4',
			fullscreenStore.isEnabled && 'bottom-9'
		)}
	>
		<div
			class="bg-contrast text-text pointer-events-auto flex max-h-52 w-full max-w-7xl flex-col gap-4 overflow-auto rounded-xl p-4"
		>
			<div
				class={clm(
					'adaptive-padding',
					lastFrame.text && lastFrame.text.length > 50 ? 'adaptive-font' : 'adaptive-font-upper'
				)}
			>
				{@html correctWhitespace(lastFrame.text!) || 'Пустота...'}
			</div>
			<div class="flex flex-col items-start gap-2">
				{#if availableChoicesCount}
					{#each lastFrame.choices as choice (choice.choiceId)}
						{#if enabledChoice(lastFrame.modificators, choice)}
							<Choice {storyId} frameId={lastFrame.frameId} {choice} />
						{/if}
					{/each}
				{:else}
					<Button
						{loading}
						class={clm(
							button.size.lg,
							button.type.primary,
							'adaptive-font adaptive-padding pointer-events-auto'
						)}
						onclick={handleEndStory}
					>
						Завершить историю
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
