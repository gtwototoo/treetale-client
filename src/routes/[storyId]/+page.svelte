<script lang="ts">
	import { onMount } from 'svelte';
	import type { KeyboardEventHandler } from 'svelte/elements';

	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import cloneDeep from 'lodash/cloneDeep';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import last from 'lodash/last';
	import { Button } from 'treetale-ui';

	import type { MathModificator } from '$lib/types/index';

	import ReadFrame from '$lib/components/ReadFrame.svelte';
	import StoryDescription from '$lib/components/StoryDescription.svelte';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { framesStore, fullscreenStore } from '$lib/stores/reading.svelte';
	import { soundStore } from '$lib/stores/sound.svelte';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import { rootStyle } from '$lib/utils/customColors';
	import { choiceModificators, correctToType, doMath } from '$lib/utils/variableOperations';

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

		const setFastChoice = () => {
			const lastFrame = last(data.frames);
			const correctChoices = lastFrame?.choices.filter((c) => c.frameId);

			if (lastFrame && correctChoices?.length === 1) {
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
		const frame = find(framesStore.frames, { frameId });

		if (!frame) return;

		const choice = find(frame?.choices, { choiceId });

		const mathModificators = choiceModificators(frame, choiceId, 'math') as MathModificator[];

		if (!choice || !mathModificators.length) return;

		for (const { symbol, value, variable: name } of mathModificators) {
			const variableId = findIndex(variablesStore.variables, { name });
			const { expect } = variablesStore.variables[variableId];
			const firstValue = variablesStore.variables[variableId].value;

			variablesStore.variables[variableId].value = doMath(
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
			await updateProgress(story.storyId, choiceId);

			updateVars(frameId, choiceId);

			await invalidateAll();

			soundStore.sound?.play();
		} catch (e) {
			console.error(e);
		}
	};

	const handleFullscreenChange = () => {
		fullscreenStore.isEnabled = !!document.fullscreenElement;
	};

	const handleFulscreen = async () => {
		await document.exitFullscreen();
	};

	let frame = $derived(
		progress.length ? find(frames, { frameId: last(progress)!.nextFrameId }) : frames?.[0]
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

{#if frame}
	<div
		class="absolute flex size-full items-start justify-center overflow-auto bg-main"
		id="read-screen"
	>
		<div class="flex min-h-full w-full items-center justify-center p-4 py-20 max-sm:p-3">
			{#if storyState === 'started'}
				<ReadFrame
					{frame}
					onclick={(choiceId) => setChoice(frame.frameId, choiceId)}
					onresults={() => (storyState = 'ended')}
				/>
			{:else}
				<StoryDescription
					{frames}
					{progress}
					{author}
					{version}
					{updated}
					{story}
					{storyState}
					onclick={() => (storyState = 'started')}
				/>
			{/if}
		</div>
		{#if fullscreenStore.isEnabled}
			<Button
				class="fixed bottom-0 left-0 w-full justify-center rounded-none bg-main-90 text-text text-opacity-10 hover:text-opacity-100"
				onclick={handleFulscreen}
			>
				Выйти
			</Button>
		{/if}
	</div>
{/if}
