<script lang="ts">
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';

	import { currentThemeClass } from '$lib/stores/colors.svelte';
	import type { Choice, Frame } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { choiceModificators } from '$lib/utils/variableOperations';

	import { boardFramesStore, connectionStartStore } from '$board/stores/frames.svelte';
	import {
		boardStateStore,
		isBindingMode,
		isViewMode,
		readonlyModeStore
	} from '$board/stores/index.svelte';

	type HTMLContentEditable = HTMLDivElement;

	const {
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
		const choiceInputs = document.getElementById('choices')?.querySelectorAll('[contenteditable]');

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
	let disabled = $derived(isBindingMode() && connectionStartStore.frameId !== null && !selfConnect);

	let greenHoverBackgroundColor = $derived(
		currentThemeClass(clm('hover:bg-emerald-950'), clm('hover:bg-emerald-200'))
	);
	let greenBackgroundColor = $derived(
		currentThemeClass(
			clm('bg-emerald-900 ring-emerald-700 hover:bg-red-800 hover:ring-red-500/50'),
			clm('bg-emerald-100 ring-emerald-300 hover:bg-red-200 hover:ring-red-500/50')
		)
	);
	let bindingClasses = $derived(
		isBindingMode() &&
			clm(
				'hover:ring-emerald-500/50',
				greenHoverBackgroundColor,
				connectionStartStore.frameId !== null && selfConnect && greenBackgroundColor
			)
	);
</script>

<Button
	class={clm(
		'group/button',
		button.size.base,
		button.type.primary,
		'py-3',
		!text && 'text-gray-400',
		disabled && '!bg-contrast pointer-events-none',
		bindingClasses
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
			'group-hover/block:after:!to-text flex items-center justify-center group-hover/button:!border-emerald-500/50',
			toFrame && toFrame.x < frame.x ? 'left-bind-point ml-1' : 'right-bind-point ml-1',
			(isSelected || isDragging) && 'after:!to-text',
			isSelectedBindingChoice && 'after:!to-emerald-500',
			isDragging && 'after:!-inset-1.25',
			connectionStartStore.frameId !== null &&
				selfConnect &&
				'!border-emerald-500/50 group-hover/button:!border-red-500/50'
		)}
	>
		{#if !toFrame}
			<div class="size-3 rounded-full bg-red-500"></div>
		{/if}
	</div>
</Button>
