<script lang="ts">
	import type {
		EmblaCarouselType,
		EmblaOptionsType,
		EmblaPluginType
	} from 'embla-carousel-svelte';

	import Button from '$UI/Button.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
	import { MetaTags } from 'svelte-meta-tags';

	import ReadFrame from '$lib/components/ReadFrame.svelte';
	import StoryDescription from '$lib/components/StoryDescription.svelte';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import { DEFAULT_COLOR } from '$lib/constants.js';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyColorStore } from '$lib/stores/main.js';
	import {
		framesStore,
		fullscreenStore,
		soundStore,
		variablesStore
	} from '$lib/stores/reading.js';
	import {
		correctToType,
		doMath,
		getChoiceFromId,
		getFrameFromId,
		last,
		rootStyle
	} from '$lib/utils';

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
			ArrowDown: nextFrame,
			ArrowUp: prevFrame,
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

		for (const { symbol, value, variable } of choice.mathOperations) {
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
			await updateProgress(storyId, choiceId);

			updateVars(frameId, choiceId);

			await invalidateAll();

			$soundStore?.play();
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

	$: ({ color, description, storyId, title } = data.story);
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

<MetaTags {description} {title} />

<ska:html class="h-full" />
<svelte:body class="h-full" />

<svelte:window on:fullscreenchange={handleFullscreenChange} on:keydown={handleKeydown} />

<SvgGradient id={storyId} />
<div class="absolute h-full w-full" id="read-screen">
	<div
		class="flex h-full w-full px-4 py-20 max-sm:px-3"
		on:emblaInit={handleInit}
		use:emblaCarouselSvelte={{ options, plugins }}
	>
		<div class="flex w-full flex-col items-center gap-4">
			<StoryDescription author={data.author} story={data.story} />
			{#each $framesStore as { frameId }, key}
				{@const isLastFrame = key === $framesStore.length - 1}
				<ReadFrame
					class={clsx(!isLastFrame && 'pointer-events-none opacity-10')}
					{frameId}
					{isLastFrame}
					on:click={({ detail }) => setChoice(frameId, detail.choiceId)}
					selectedChoiceId={data.progress[key]?.choiceId}
				/>
			{/each}
		</div>
	</div>
	{#if $fullscreenStore}
		<Button
			class="!fixed bottom-0 left-0 w-full justify-center !rounded-none bg-main-90 text-text text-opacity-10 hover:text-opacity-100"
			on:click={handleFulscreen}
			variant="custom"
		>
			Выйти
		</Button>
	{/if}
</div>
