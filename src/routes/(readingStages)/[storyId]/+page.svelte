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
	import RootStyles from '$lib/components/RootStyles.svelte';
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { interfaceStore } from '$lib/stores/reading.svelte';
	import { variablesStore } from '$lib/stores/variables.svelte';
	import { clm } from '$lib/utils/classMerge';

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
	const { story, progress, author, scopeFrames } = $derived(clonedData);
	const { choices, progressId } = $derived(progress);
	const lastFrame = $derived(
		choices.length ? find(scopeFrames, { frameId: last(choices)!.nextFrameId })! : scopeFrames?.[0]
	);
	const { description, genre, likes, title, color, vars, storyId, format } = $derived(story);

	onMount(() => {
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

<RootStyles init={color || DEFAULT_COLOR} />

<svelte:window onkeydown={handleKeydown} />

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
			<CanvasView frames={scopeFrames} {choices} {storyId} {progressId} />
		{:else}
			<FramesView {lastFrame} {storyId} {progressId} />
		{/if}
	</div>
{/if}
