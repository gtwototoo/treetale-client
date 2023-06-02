<script lang="ts">
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import Frame from '$lib/components/Frame.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyColorStore, currentPanelStore } from '$lib/stores/main';
	import { storyStore } from '$lib/stores/reading';
	import { rootStyle } from '$lib/utils/custom_colors';
	import { onMount } from 'svelte';

	export let data;

	let cardsRef: HTMLDivElement;
	let current = data.progress.length;

	$: scrollTo(current - 1);

	const handleKeydown = (e: KeyboardEvent) => {
		e.preventDefault();

		switch (e.key) {
			case 'ArrowUp': {
				if (current > 1) current -= 1;
				break;
			}
			case 'ArrowDown': {
				if (current < data.progress.length) current += 1;
				break;
			}
			case 'Space': {
				const lastFrameChoices = data.frames.at(-1)?.choices;

				if (lastFrameChoices && lastFrameChoices.length === 1)
					setChoice(lastFrameChoices[0].choiceId);
				break;
			}
		}
	};

	const setChoice = async (id: number) => {
		try {
			await updateProgress(data.story.storyId, id);
			await invalidateAll();

			current = data.progress.length;
		} catch (e) {
			console.error(e);
		}
	};

	const scrollTo = (element: number) => {
		if (cardsRef) {
			const scrollToElement = cardsRef.children[element];
			const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

			scrollToElement.scrollIntoView({
				block: 'start',
				inline: 'nearest',
				behavior: mediaQuery.matches ? 'auto' : 'smooth'
			});
		}
	};

	onMount(() => {
		$storyStore = data.story;

		scrollTo(current - 1);

		return () => {
			currentPanelStore.clear();
		};
	});

	afterNavigate(() => {
		scrollTo(current - 1);
	});

	$bodyColorStore = data.story.color || DEFAULT_COLOR;
</script>

<svelte:head>
	<title>{data.story.title}</title>
	{@html rootStyle($bodyColorStore)}
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="flex flex-col items-center p-2 !pt-0 sm:p-4" bind:this={cardsRef}>
	{#each data.frames as frame, key}
		<Frame
			class="pt-2 sm:pt-4"
			vars={data.story.vars}
			{frame}
			{setChoice}
			selectedChoiceId={data.progress[key].choiceId}
			last={key === data.frames.length - 1}
		/>
	{/each}
</div>
