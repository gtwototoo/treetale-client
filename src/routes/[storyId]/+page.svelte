<script lang="ts">
	import { onMount } from 'svelte';
	import type { KeyboardEventHandler } from 'svelte/elements';

	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import cloneDeep from 'lodash/cloneDeep';
	import find from 'lodash/find';
	import last from 'lodash/last';

	import CanvasView from '$lib/components/FormatView/CanvasView.svelte';
	import FramesView from '$lib/components/FormatView/FramesView.svelte';
	import InterfaceViewButton from '$lib/components/FormatView/InterfaceViewButton.svelte';
	import NovellaView from '$lib/components/FormatView/NovellaView.svelte';
	import StoryStage from '$lib/components/StoryStage.svelte';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import { setChoice } from '$lib/components/methods.svelte.js';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { fullscreenStore, interfaceStore } from '$lib/stores/reading.svelte';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { rootStyle } from '$lib/utils/customColors';

	let { data } = $props();

	let clonedData = $derived(cloneDeep(data));
	let { author, frames, progress, story, updated, version } = $derived(clonedData);

	// const isFullscreen = () => {
	// 	return (
	// 		document.fullscreenElement ||
	// 		document.webkitFullscreenElement ||
	// 		document.mozFullScreenElement ||
	// 		document.webkitIsFullScreen
	// 	);
	// };

	let storyState = $state<'begin' | 'ended' | 'started'>('begin');

	const handleKeydown: KeyboardEventHandler<Window> = (e) => {
		const { code } = e;

		const setFastChoice = async () => {
			if (!$page.data.session) {
				goto('/signin');
			}

			const lastFrame = last(data.frames);
			const correctChoices = lastFrame?.choices.filter((c) => c.frameId);

			if (lastFrame && correctChoices?.length === 1) {
				await setChoice(story.storyId, lastFrame.frameId, lastFrame.choices[0].choiceId);
				await invalidateAll();
			}
		};

		const actions: Record<string, () => void> = {
			Space: setFastChoice
		};

		if (!(code in actions)) return;

		e.preventDefault();

		actions[code]();
	};

	const handleFullscreenChange = () => {
		fullscreenStore.isEnabled = !!document.fullscreenElement;
	};

	let lastFrame = $derived(
		progress.length ? find(frames, { frameId: last(progress)!.nextFrameId })! : frames?.[0]
	);

	onMount(() => {
		bodyBackgroundColorStore.color = story.color.length ? story.color : DEFAULT_COLOR;
		variablesStore.variables = story.vars;
	});

	// let bookSchema = $derived({
	// 	'@type': 'Book',
	// 	abstract: description,
	// 	bookFormat: 'EBook',
	// 	genre,
	// 	interactionStatistic: {
	// 		'@type': 'InteractionCounter',
	// 		interactionType: {
	// 			'@type': 'LikeAction'
	// 		},
	// 		userInteractionCount: likes.length
	// 	},
	// 	name: title,
	// 	publisher: {
	// 		'@type': 'Person',
	// 		name: author.name
	// 	}
	// } as Book);
</script>

<svelte:head>
	{@html rootStyle(bodyBackgroundColorStore.color)}
	<meta name="description" content={story.description} />
	<title>{story.title}</title>
</svelte:head>

<svelte:window onfullscreenchange={handleFullscreenChange} onkeydown={handleKeydown} />

<SvgGradient />

{#if storyState === 'started'}
	{#if story.format === 'novella'}
		<NovellaView {lastFrame} storyId={story.storyId} bind:storyState />
	{:else}
		<div
			class={clm(
				'pointer-events-none relative flex min-h-full w-full items-center justify-center px-4 py-20 transition-[padding]',
				!interfaceStore.show && 'py-4'
			)}
		>
			<InterfaceViewButton />
			{#if story.format === 'canvas'}
				<CanvasView {frames} {progress} storyId={story.storyId} bind:storyState />
			{:else}
				<FramesView {lastFrame} storyId={story.storyId} bind:storyState />
			{/if}
		</div>
	{/if}
{:else}
	<div
		class={clm(
			'pointer-events-none relative flex min-h-full w-full items-center justify-center px-4 py-20 transition-[padding]',
			!interfaceStore.show && 'py-4'
		)}
	>
		<InterfaceViewButton />
		<StoryStage
			bind:storyState
			{story}
			{author}
			{updated}
			{frames}
			{progress}
			progressVersion={version}
		/>
	</div>
{/if}
