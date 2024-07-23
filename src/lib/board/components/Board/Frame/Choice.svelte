<script lang="ts">
	import { boardFramesStore, connectionStartStore } from '$board/stores/frames.svelte';
	import { boardStateStore, readonlyModeStore } from '$board/stores/index.svelte';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import { Button } from 'treetale-ui';

	import type { Choice, Frame } from '$lib/types';

	import { currentThemeClass } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	type HTMLContentEditable = HTMLDivElement;

	let {
		choice,
		frame
	}: {
		choice: Choice;
		frame: Frame;
	} = $props();

	let { choiceId, frameId: toFrameId, logicOperations, mathOperations, text } = $derived(choice);

	const choiceFocus = (choiceId: number) => {
		const choiceKey = findIndex(frame.choices, { choiceId });
		const choiceInputs = document
			.getElementById('choices')
			?.querySelectorAll('[contenteditable]');

		if (!choiceInputs) {
			return;
		}

		const currentInput = choiceInputs[choiceKey] as HTMLContentEditable;

		currentInput.focus();

		if (currentInput.lastChild && currentInput.firstChild) {
			const newRange = document.createRange();
			const selection = window.getSelection();

			newRange.setStart(currentInput.firstChild, currentInput.innerHTML.length);

			if (!selection) return;

			selection.removeAllRanges();
			selection.addRange(newRange);
		}
	};

	const handleMouseDown = (e: MouseEvent) => {
		if (boardStateStore.mode !== 'binding') return;

		e.stopPropagation();
	};

	const handleClick = () => {
		if (boardStateStore.mode === 'view' && !readonlyModeStore.isEnabled) {
			choiceFocus(choiceId);
		}

		if (boardStateStore.mode === 'binding') {
			if (connectionStartStore?.choiceId === choiceId) {
				connectionStartStore.clear();

				return;
			}

			connectionStartStore.set(frame.frameId, choiceId);
		}
	};

	let toFrame = $derived(find(boardFramesStore.frames, { frameId: toFrameId! }));
	let selfConnect = $derived(
		connectionStartStore.frameId === frame.frameId && connectionStartStore.choiceId === choiceId
	);
	let disabled = $derived(
		boardStateStore.mode === 'binding' && connectionStartStore.frameId !== null && !selfConnect
	);

	let greenHoverBackgroundColor = $derived(
		currentThemeClass(clm('hover:bg-emerald-800'), clm('hover:bg-emerald-200'))
	);
	let greenBackgroundColor = $derived(
		currentThemeClass(clm('bg-emerald-800'), clm('bg-emerald-200'))
	);
	let orangeBackgroundColor = $derived(
		currentThemeClass(clm('bg-orange-800'), clm('bg-orange-200'))
	);
</script>

<Button
	class={clm(
		'gap-4 bg-contrast-5',
		text ? 'text-text' : 'text-gray-400',
		boardStateStore.mode === 'binding' &&
			clm(
				'bg-contrast-5',
				greenHoverBackgroundColor,
				toFrameId && orangeBackgroundColor,
				connectionStartStore.frameId !== null && selfConnect && greenBackgroundColor
			)
	)}
	{disabled}
	onclick={handleClick}
	onmousedown={handleMouseDown}
>
	{#if logicOperations.length}
		<div class="absolute left-1 h-7 w-1 rounded-full !bg-orange-500"></div>
	{/if}
	<p class="truncate">{@html text || 'Вариант выбора'}</p>
	{#if mathOperations.length}
		<div class="absolute right-1 h-7 w-1 rounded-full !bg-violet-500"></div>
	{/if}
	<div class={clm(toFrame && toFrame.x < frame.x ? 'leftBindPoint' : 'rightBindPoint')}></div>
</Button>
