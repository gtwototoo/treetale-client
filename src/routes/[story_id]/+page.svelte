<script lang="ts">
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import Frame from '$lib/components/Frame.svelte';
	import Reading from '$lib/components/modules/Header/Reading.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { updateProgress } from '$lib/requests/progress';
	import { currentHeader, currentPanel } from '$lib/stores/main';
	import { infoStore } from '$lib/stores/reading';
	import { rootStyle } from '$lib/utils/custom_colors.js';
	import { onMount } from 'svelte';

	$currentHeader = Reading;

	export let data;

	let cardsRef: HTMLDivElement;
	let current = data.progress.length;

	$: scrollTo(current - 1);

	const handleKeydown = (e: KeyboardEvent) => {
		e.preventDefault();

		switch (e.key) {
			case 'ArrowUp':
				if (current > 1) current -= 1;
				break;
			case 'ArrowDown':
				if (current < data.progress.length) current += 1;
				break;
			case 'Space':
				const lastFrameChoices = data.frames.at(-1)?.choices;

				if (lastFrameChoices && lastFrameChoices.length === 1)
					setChoice(lastFrameChoices[0].choiceId);
				break;
		}
	};

	const setChoice = async (id: number) => {
		const response = await updateProgress(data.story.storyId, id);

		if (!response.error) {
			await invalidateAll();

			current = data.progress.length;
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
		infoStore.set(data.story);

		scrollTo(current - 1);

		return () => {
			currentPanel.clear();
		};
	});

	afterNavigate(() => {
		scrollTo(current - 1);
	});
</script>

<svelte:head>
	<title>{data.story.title}</title>
	{@html rootStyle(DEFAULT_COLOR)}
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
