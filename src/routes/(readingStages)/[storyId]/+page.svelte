<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { KeyboardEventHandler } from 'svelte/elements';

	import cloneDeep from 'lodash/cloneDeep';
	import find from 'lodash/find';
	import last from 'lodash/last';
	import type { Book } from 'schema-dts';
	import { JsonLd, MetaTags } from 'svelte-meta-tags';

	import CanvasView from '$lib/components/FormatView/CanvasView.svelte';
	import FramesView from '$lib/components/FormatView/FramesView.svelte';
	import InterfaceViewButton from '$lib/components/FormatView/InterfaceViewButton.svelte';
	import NovellaView from '$lib/components/FormatView/NovellaView.svelte';
	import { enabledChoice, setChoice } from '$lib/components/methods.svelte.js';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { interfaceStore } from '$lib/stores/reading.svelte';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { rootStyle } from '$lib/utils/customColors';

	const { data } = $props();

	// const isFullscreen = () => {
	// 	return (
	// 		document.fullscreenElement ||
	// 		document.webkitFullscreenElement ||
	// 		document.mozFullScreenElement ||
	// 		document.webkitIsFullScreen
	// 	);
	// };

	const handleKeydown: KeyboardEventHandler<Window> = (e) => {
		const { code } = e;

		const setFastChoice = async () => {
			if (!page.data.session) {
				await goto('/signin');
			}

			let availableChoicesCount = lastFrame.choices.filter((choice) =>
				enabledChoice(lastFrame.modificators, choice)
			).length;

			if (availableChoicesCount === 1) {
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
	const clonedData = $derived(cloneDeep(data));
	const { frames, choices, story, progressId, author } = $derived(clonedData);
	const lastFrame = $derived(
		choices.length ? find(frames, { frameId: last(choices)!.nextFrameId })! : frames?.[0]
	);
	const { description, genre, likes, title, color, vars, storyId, format } = $derived(story);

	onMount(() => {
		bodyBackgroundColorStore.color = length ? color : DEFAULT_COLOR;
		variablesStore.variables = vars;
	});

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

<JsonLd schema={bookSchema} />
<MetaTags {description} {title} />

<svelte:head>
	{@html rootStyle(bodyBackgroundColorStore.color)}
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<SvgGradient />

{#if format === 'novella'}
	<NovellaView {lastFrame} {storyId} {progressId} />
{:else}
	<div
		class={clm(
			'pointer-events-none relative flex min-h-full w-full items-center justify-center px-4 py-20 transition-[padding]',
			!interfaceStore.show && 'py-8'
		)}
	>
		<InterfaceViewButton />
		{#if format === 'canvas'}
			<CanvasView {frames} {choices} {storyId} {progressId} />
		{:else}
			<FramesView {lastFrame} {storyId} {progressId} />
		{/if}
	</div>
{/if}
