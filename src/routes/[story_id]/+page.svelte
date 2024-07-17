<script lang="ts">
	import type { Book } from 'schema-dts';

	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import last from 'lodash/last';

	import ReadFrame from '$lib/components/ReadFrame.svelte';
	import StoryDescription from '$lib/components/StoryDescription.svelte';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyColorStore } from '$lib/stores/main';
	import {
		framesStore,
		fullscreenStore,
		soundStore,
		variablesStore
	} from '$lib/stores/reading.js';
	import { rootStyle } from '$lib/utils/customColors.js';
	import { correctToType, doMath } from '$lib/utils/variableOperations.js';
	import { onMount } from 'svelte';
	import type { KeyboardEventHandler } from 'svelte/elements';
	import { Button } from 'treetale-ui';

	let { data } = $props();

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

		const setFastChoice = () => {
			const lastFrame = last(data.frames);

			if (lastFrame?.choices && lastFrame?.choices.length === 1) {
				setChoice(lastFrame.frameId, lastFrame.choices[0].choiceId);
			}
		};

		const actions: Record<string, () => void> = {
			Space: setFastChoice
		};

		if (!(code in actions)) return;

		e.preventDefault();

		actions[code]();
	};

	const updateVars = (frameId: number, choiceId: number) => {
		const frame = find($framesStore, { frameId });
		const choice = find(frame?.choices, { choiceId });

		if (!choice || !choice.mathOperations.length) return;

		for (const { symbol, value, variable: name } of choice.mathOperations) {
			const variableId = findIndex($variablesStore, { name });
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

			$soundStore.sound?.play();
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

	onMount(() => {
		$bodyColorStore = color.length ? color : DEFAULT_COLOR;
		$framesStore = frames;
		$variablesStore = vars;
	});

	let { author, frames, progress, story } = data;
	let { color, description, genre, likes, storyId, title, vars } = story;
	let frame = $derived(
		progress.length ? find(frames, { frameId: last(progress)!.nextFrameId }) : $framesStore?.[0]
	);
	let bookSchema = $derived({
		'@type': 'Book',
		abstract: description,
		bookFormat: 'EBook',
		genre,
		interactionStatistic: {
			'@type': 'InteractionCounter',
			interactionType: {
				'@type': 'LikeAction'
			},
			userInteractionCount: likes.length
		},
		name: title,
		publisher: {
			'@type': 'Person',
			name: author.name
		}
	} as Book);
</script>

<svelte:head>
	{@html rootStyle($bodyColorStore)}
	<meta name="description" content={description} />
	<title>{title}</title>
</svelte:head>

<svelte:window onfullscreenchange={handleFullscreenChange} onkeydown={handleKeydown} />

<SvgGradient />

{#if frame}
	<div class="absolute flex size-full items-start justify-center overflow-auto" id="read-screen">
		<div class="flex min-h-full w-full items-center justify-center p-4 py-20 max-sm:p-3">
			{#if storyState === 'started'}
				<ReadFrame
					{likes}
					{storyId}
					frameId={frame.frameId}
					onclick={(choiceId) => setChoice(frame.frameId, choiceId)}
					onresults={() => (storyState = 'ended')}
				/>
			{:else}
				<StoryDescription
					{frames}
					{progress}
					{author}
					{story}
					{storyState}
					onclick={() => (storyState = 'started')}
				/>
			{/if}
		</div>
		{#if $fullscreenStore}
			<Button
				class="fixed bottom-0 left-0 w-full justify-center rounded-none bg-main-90 text-text text-opacity-10 hover:text-opacity-100"
				onclick={handleFulscreen}
			>
				Выйти
			</Button>
		{/if}
	</div>
{/if}
