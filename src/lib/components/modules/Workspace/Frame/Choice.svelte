<script lang="ts">
	import clsx from 'clsx';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';

	import type { ILogicOperation, IMathOperation } from '$lib/types';

	import { Button } from '$UI';
	import { readonlyStore } from '$lib/stores/editing';
	import { bodyColorStore } from '$lib/stores/main';
	import { activeModeStore, connectionStore, framesDataStore } from '$lib/stores/workspace';
	import { clm, contrastText } from '$lib/utils';

	type HTMLContentEditable = ElementContentEditable & HTMLDivElement;

	export let choiceId: number;
	export let text: string;
	export let logicOperations: Array<ILogicOperation>;
	export let mathOperations: Array<IMathOperation>;
	export let frameKey: number;

	let toFrameId: number;
	export { toFrameId as frameId };

	$: frame = $framesDataStore[frameKey];

	const choiceFocus = (choiceId: number) => {
		const choiceKey = findIndex($framesDataStore[frameKey].choices, { choiceId });
		const choiceInputs: NodeListOf<HTMLContentEditable> = document
			.getElementById('choices')
			?.querySelectorAll('[contenteditable]');

		if (!choiceInputs) {
			return;
		}

		choiceInputs[choiceKey].focus();

		if (choiceInputs[choiceKey].lastChild) {
			const newRange = document.createRange();
			const selection = window.getSelection();

			newRange.setStart(
				choiceInputs[choiceKey].firstChild,
				choiceInputs[choiceKey].innerHTML.length
			);

			selection.removeAllRanges();
			selection.addRange(newRange);
		}
	};

	const handleMouseDown = (e: MouseEvent) => {
		if ($activeModeStore !== 'binding') return;

		e.stopPropagation();
	};

	const handleClick = () => {
		if ($activeModeStore === 'view' && !$readonlyStore) {
			choiceFocus(choiceId);
		}

		if ($activeModeStore === 'binding') {
			if ($connectionStore && $connectionStore.choiceId === choiceId) {
				$connectionStore = null;
				return;
			}

			$connectionStore = {
				choiceId,
				frameId: frame.frameId
			};
		}
	};

	$: toFrame = find($framesDataStore, { frameId: toFrameId });

	$: greenHoverColor = contrastText($bodyColorStore)
		? clsx('hover:!bg-emerald-800')
		: clsx('hover:!bg-emerald-200');
	$: greenColor = contrastText($bodyColorStore)
		? clsx('!bg-emerald-800')
		: clsx('!bg-emerald-200');
	$: orangeColor = contrastText($bodyColorStore) ? clsx('bg-orange-800') : clsx('bg-orange-200');
	$: disabled =
		$activeModeStore === 'binding' &&
		$connectionStore &&
		!($connectionStore.choiceId === choiceId && $connectionStore.frameId === frame.frameId);
</script>

<Button
	class={clm(
		'gap-4',
		!text ? '!text-gray-400' : '!text-text',
		$activeModeStore === 'binding'
			? clsx(
					'bg-main-60',
					greenHoverColor,
					toFrameId && orangeColor,
					$connectionStore &&
						$connectionStore.frameId === frame.frameId &&
						$connectionStore.choiceId === choiceId &&
						greenColor
				)
			: 'bg-contrast-5'
	)}
	{disabled}
	on:click={handleClick}
	on:mousedown={handleMouseDown}
	variant="main"
>
	{#if logicOperations.length}
		<div class="absolute left-1 h-7 w-1 rounded-full !bg-orange-500" />
	{/if}
	<p class="truncate">{@html text || 'Вариант выбора'}</p>
	{#if mathOperations.length}
		<div class="absolute right-1 h-7 w-1 rounded-full !bg-violet-500" />
	{/if}
	<div class={clsx(toFrame && toFrame.x < frame.x ? 'leftBindPoint' : 'rightBindPoint')} />
</Button>
