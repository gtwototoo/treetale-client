<script lang="ts">
	import { boardFramesStore, connectionStartStore } from '$board/stores/frames.svelte';
	import {
		boardStateStore,
		isBindingMode,
		isViewMode,
		readonlyModeStore
	} from '$board/stores/index.svelte';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import { Button } from 'treetale-ui';

	import type { Choice, Frame } from '$lib/types';

	import { currentThemeClass } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { choiceModificators } from '$lib/utils/variableOperations';

	type HTMLContentEditable = HTMLDivElement;

	let {
		choice,
		frame,
		isDragging,
		isSelected,
		isSelectedBindingChoice
	}: {
		choice: Choice;
		frame: Frame;
		isDragging: boolean;
		isSelected: boolean;
		isSelectedBindingChoice: boolean;
	} = $props();

	let { choiceId, frameId: toFrameId, text } = $derived(choice);

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
		if (isViewMode() && !readonlyModeStore.isEnabled) {
			choiceFocus(choiceId);
		}

		if (isBindingMode()) {
			if (connectionStartStore?.choiceId === choiceId) {
				connectionStartStore.clear();

				return;
			}

			connectionStartStore.set(frame.frameId, choiceId);
			boardStateStore.action = 'connectTo';
		}
	};

	let toFrame = $derived(find(boardFramesStore.frames, { frameId: toFrameId! }));
	let selfConnect = $derived(
		connectionStartStore.frameId === frame.frameId && connectionStartStore.choiceId === choiceId
	);
	let disabled = $derived(
		isBindingMode() && connectionStartStore.frameId !== null && !selfConnect
	);

	let greenHoverBackgroundColor = $derived(
		currentThemeClass(clm('hover:bg-emerald-800'), clm('hover:bg-emerald-200'))
	);
	let greenBackgroundColor = $derived(
		currentThemeClass(clm('bg-emerald-800'), clm('bg-emerald-200'))
	);
	let greenGroupHoverBackgroundColor = $derived(
		currentThemeClass(clm('group-hover:!bg-emerald-800'), clm('group-hover:!bg-emerald-200'))
	);
	let orangeBackgroundColor = $derived(
		currentThemeClass(clm('bg-orange-800'), clm('bg-orange-200'))
	);
</script>

<Button
	class={clm(
		'gap-4 bg-contrast-5',
		text ? 'text-text' : 'text-gray-400',
		disabled && 'pointer-events-none !bg-contrast',
		isSelectedBindingChoice && greenGroupHoverBackgroundColor,
		isBindingMode() &&
			clm(
				'bg-contrast-5',
				greenHoverBackgroundColor,
				toFrameId && orangeBackgroundColor,
				connectionStartStore.frameId !== null && selfConnect && greenBackgroundColor
			)
	)}
	onclick={handleClick}
	onmousedown={handleMouseDown}
>
	{#if choiceModificators(frame.modificators, choice.choiceId, 'logic').length}
		<div class="absolute left-1 h-7 w-1 rounded-full !bg-orange-500"></div>
	{/if}
	<p class="truncate">{@html text || 'Вариант выбора'}</p>
	{#if choiceModificators(frame.modificators, choice.choiceId, 'math').length}
		<div class="absolute right-1 h-7 w-1 rounded-full !bg-blue-500"></div>
	{/if}
	<div
		class={clm(
			toFrame && toFrame.x < frame.x ? 'leftBindPoint' : 'rightBindPoint',
			(isSelected || isDragging) && 'after:to-text',
			isSelectedBindingChoice && 'group-hover:after:to-green-500',
			isDragging && 'after:-inset-1'
		)}
	></div>
</Button>
