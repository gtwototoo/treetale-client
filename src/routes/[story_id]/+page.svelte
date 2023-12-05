<script lang="ts">
	import { Button, Tag } from '$UI';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Likes from '$lib/components/Likes.svelte';
	import ProfileLink from '$lib/components/ProfileLink.svelte';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import ReadFrame from '$lib/components/ReadFrame.svelte';
	import SvgGradient from '$lib/components/SvgGradient.svelte';
	import { DEFAULT_COLOR } from '$lib/constants.js';
	import { updateProgress } from '$lib/requests/progress';
	import { bodyColorStore } from '$lib/stores/main.js';
	import { framesStore, fullscreenStore, variablesStore } from '$lib/stores/reading.js';
	import { getChoiceFromId, getFrameFromId, last, rootStyle } from '$lib/utils';
	import { correctToType, doMath } from '$lib/utils/variable_operations.js';
	import clsx from 'clsx';
	import { ArrowsPointingIn, BookOpen } from 'svelte-heros-v2';

	export let data;

	let current = data.progress.length;

	let currentElement: HTMLElement;
	let currentTranslate: number;

	const prevFrame = () => {
		if (current >= 1) {
			current -= 1;
		}
	};

	const nextFrame = () => {
		if (currentTranslate + currentElement.clientHeight + 88 > window.innerHeight) {
			currentTranslate = currentTranslate - window.innerHeight / 2;
		} else if (current < data.progress.length) {
			current += 1;
		}
	};

	const handleKeydown = (e: KeyboardEvent) => {
		const { code } = e;

		const nextZeroChoicesFrame = () => {
			const lastFrame = last(data.frames);

			if (lastFrame?.choices && lastFrame?.choices.length === 1) {
				setChoice(lastFrame.frameId, lastFrame.choices[0].choiceId);
			}
		};

		const actions: Record<string, () => void> = {
			ArrowUp: prevFrame,
			ArrowDown: nextFrame,
			Space: nextZeroChoicesFrame
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

			current = data.progress.length;
		} catch (e) {
			console.error(e);
		}
	};

	const setPosition = (node: HTMLDivElement, current: number) => {
		const changePosition = (current: number) => {
			const childs = Array.from(node.childNodes).filter(
				(element) => element instanceof HTMLElement
			) as Array<HTMLElement>;

			currentElement = childs[current];

			const outEdge = currentElement.clientHeight > window.innerHeight;

			const translate = outEdge
				? currentElement.offsetTop - 88
				: currentElement.offsetTop + currentElement.clientHeight / 2 - window.innerHeight / 2;

			currentTranslate = -translate;
		};

		changePosition(current);

		return {
			update(current: number) {
				changePosition(current);
			}
		};
	};

	const handleWheel = (e: WheelEvent) => {
		if (e.deltaY > 0) {
			nextFrame();
		} else {
			prevFrame();
		}
	};

	const handleFulscreen = async () => {
		await document.exitFullscreen();

		$fullscreenStore = false;
	};

	$: ({ storyId, title, description, author, created, draft, likes, color } = data.story);
	$: $bodyColorStore = color.length ? color : DEFAULT_COLOR;
	$: $framesStore = data.frames;

	$framesStore = data.frames;
	$variablesStore = data.story.vars;
</script>

<svelte:head>
	<title>{title}</title>
	{@html rootStyle($bodyColorStore, {
		'fill-gradient': `url(#light-gradient-${storyId})`
	})}
</svelte:head>

<ska:html class="h-full" />
<svelte:body class="h-full" />
<svelte:window on:keydown={handleKeydown} on:wheel={handleWheel} />

<SvgGradient id={storyId} />
<div
	class="flex h-full w-full items-start justify-center overflow-hidden p-4 max-sm:p-2"
	id="read-screen"
>
	{#if $fullscreenStore}
		<Button
			variant="ghost"
			class="header-button !fixed right-4 top-4 bg-contrast text-text"
			size="lg"
			on:click={handleFulscreen}
		>
			<Icon type={ArrowsPointingIn} class="h-6 w-6" />
		</Button>
	{/if}
	<div
		class="flex w-full flex-col items-center gap-6 transition-transform"
		style:transform="translateY({currentTranslate}px)"
		use:setPosition={current}
	>
		<ReadCard classCard="h-full text-center !items-center">
			<svelte:fragment slot="body">
				<Icon
					type={BookOpen}
					class="h-44 w-auto childs:fill-gradient max-hd:h-36 max-xl:h-28"
					variation="solid"
				/>
				<h2>{title}</h2>
				<p class="max-w-sm">{description}</p>
				<div class="flex w-full max-w-sm items-center justify-between gap-4">
					{#if author}
						<ProfileLink {author} {created} />
					{:else}
						<Tag
							class={clsx(
								draft ? 'bg-gray-300 text-gray-600' : 'bg-emerald-300 text-emerald-600'
							)}
						>
							{draft ? 'Черновик' : 'Публичный'}
						</Tag>
					{/if}
					<Likes {storyId} {likes} />
				</div>
			</svelte:fragment>
		</ReadCard>
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
