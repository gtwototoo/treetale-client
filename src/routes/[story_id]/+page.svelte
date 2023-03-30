<script lang="ts">
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import Frame from '$lib/components/Frame.svelte';
	import { DEFAULT_COLOR } from '$lib/constants';
	import { updateProgress } from '$lib/requests/progress';
	import { infoStore } from '$lib/stores/reading';
	import { mainColor } from '$lib/stores/story';
	import { onMount } from 'svelte';

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
			mainColor.set(DEFAULT_COLOR);
		};
	});

	afterNavigate(() => {
		scrollTo(current - 1);
	});

	if (data.story.color) {
		mainColor.set(data.story.color);
	}
</script>

<svelte:head>
	<title>{data.story.title}</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="flex flex-col items-center gap-2 p-2 sm:gap-3 sm:p-4" bind:this={cardsRef}>
	{#each data.frames as frame, key}
		<Frame
			vars={data.story.vars}
			{frame}
			{setChoice}
			selectedChoiceId={data.progress[key].choiceId}
			last={key === data.frames.length - 1}
		/>
	{/each}
</div>
