<script lang="ts">
	import Button from '$UI/Button.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import ReadFrame from '$lib/components/ReadFrame.svelte';
	import StoryDescription from '$lib/components/StoryDescription.svelte';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import { DEFAULT_COLOR } from '$lib/constants.js';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyColorStore } from '$lib/stores/main.js';
	import { framesStore, fullscreenStore, variablesStore } from '$lib/stores/reading.js';
	import {
		correctToType,
		doMath,
		getChoiceFromId,
		getFrameFromId,
		last,
		rootStyle
	} from '$lib/utils';
	import clsx from 'clsx';
	import type {
		EmblaCarouselType,
		EmblaOptionsType,
		EmblaPluginType
	} from 'embla-carousel-svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;

	let emblaApi: EmblaCarouselType;

	const options: EmblaOptionsType = {
		align: 'center',
		axis: 'y',
		containScroll: false,
		startIndex: data.progress.length
	};

	const plugins: Array<EmblaPluginType> = [
		WheelGesturesPlugin({
			forceWheelAxis: 'y'
		})
	];

	// const isFullscreen = () => {
	// 	return (
	// 		document.fullscreenElement ||
	// 		document.webkitFullscreenElement ||
	// 		document.mozFullScreenElement ||
	// 		document.webkitIsFullScreen
	// 	);
	// };

	const handleInit = (event: CustomEvent<EmblaCarouselType>) => {
		emblaApi = event.detail;
	};

	const prevFrame = () => {
		if (!emblaApi) return;

		emblaApi.scrollPrev();
	};

	const nextFrame = () => {
		if (!emblaApi) return;

		emblaApi.scrollNext();
	};

	const handleKeydown = (e: KeyboardEvent) => {
		const { code } = e;

		const setFastChoice = () => {
			const lastFrame = last(data.frames);

			if (lastFrame?.choices && lastFrame?.choices.length === 1) {
				setChoice(lastFrame.frameId, lastFrame.choices[0].choiceId);
			}
		};

		const actions: Record<string, () => void> = {
			ArrowUp: prevFrame,
			ArrowDown: nextFrame,
			Space: setFastChoice
		};

		if (!(code in actions)) return;

		e.preventDefault();

		actions[code]();
	};

	const updateVars = (frameId: number, choiceId: number) => {
		const frame = getFrameFromId($framesStore, frameId);
		const choice = getChoiceFromId(frame, choiceId);

		if (!choice.mathOperations.length) return;

		for (const { symbol, variable, value } of choice.mathOperations) {
			const variableId = $variablesStore.findIndex(({ name }) => name === variable);
			const { expect } = $variablesStore[variableId];
			const firstValue = $variablesStore[variableId].value;

			$variablesStore[variableId].value = doMath(
				correctToType(firstValue, expect),
				symbol,
				correctToType(value, expect)
			);
		}
	};

	const setChoice = async (frameId: number, choiceId: number) => {
		if (!$page.data.session) {
			goto('/signin');
		}

		try {
			await updateProgress(storyId, frameId, choiceId);

			updateVars(frameId, choiceId);

			await invalidateAll();
		} catch (e) {
			console.error(e);
		}
	};

	const handleFullscreenChange = () => {
		$fullscreenStore = !!document.fullscreenElement;
	};

	const handleFulscreen = async () => {
		await document.exitFullscreen();
	};

	$: ({ storyId, title, description, color } = data.story);
	$: $bodyColorStore = color.length ? color : DEFAULT_COLOR;
	$: $framesStore = data.frames;

	$framesStore = data.frames;
	$variablesStore = data.story.vars;
</script>

<svelte:head>
	{@html rootStyle($bodyColorStore, {
		'fill-gradient': `url(#light-gradient-${storyId})`
	})}
</svelte:head>

<MetaTags {title} {description} />

<ska:html class="h-full" />
<svelte:body class="h-full" />

<svelte:window on:keydown={handleKeydown} on:fullscreenchange={handleFullscreenChange} />

<SvgGradient id={storyId} />
<div id="read-screen" class="absolute h-full w-full">
	<div
		class="flex h-full w-full px-4 py-20 max-sm:px-3"
		use:emblaCarouselSvelte={{ options, plugins }}
		on:emblaInit={handleInit}
	>
		<div class="flex w-full flex-col items-center gap-4">
			<StoryDescription story={data.story} />
			{#each $framesStore as { frameId }, key}
				{@const isLastFrame = key === $framesStore.length - 1}
				<ReadFrame
					{frameId}
					on:click={({ detail }) => setChoice(frameId, detail.choiceId)}
					selectedChoiceId={data.progress[key].choiceId}
					class={clsx(!isLastFrame && 'pointer-events-none opacity-10')}
				/>
			{/each}
		</div>
	</div>
	{#if $fullscreenStore}
		<Button
			variant="custom"
			class="!fixed bottom-0 left-0 w-full justify-center !rounded-none bg-main-90 text-text text-opacity-10 hover:text-opacity-100"
			on:click={handleFulscreen}
		>
			Выйти
		</Button>
	{/if}
</div>
