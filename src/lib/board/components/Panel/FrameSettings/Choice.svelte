<script lang="ts">
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import reject from 'lodash/reject';
	import { Beaker, ChevronRight, Plus, XMark } from 'svelte-heros-v2';
	import { Button, Contenteditable, Icon } from 'treetale-ui';

	import AsInput from '$lib/components/Icons/AsInput.svelte';
	import { DEFAULT_BLOCK_WIDTH, DEFAULT_FRAME_HEIGHT } from '$lib/constants';
	import { currentThemeClass, redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { Choice, Frame } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { choiceModificators } from '$lib/utils/variableOperations';

	import { addFrame, setSelectedFrame } from '$board/components/methods.svelte';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { boardEventsStore, readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import Modificators from '../Modificators.svelte';

	type HTMLContentEditable = HTMLDivElement;

	let {
		choice,
		frame
	}: {
		choice: Choice;
		frame: Frame;
	} = $props();

	const removeChoice = () => {
		frame.choices = reject(frame.choices, { choiceId: choice.choiceId });
		boardFramesStore.frames = boardFramesStore.frames;

		changesHistoryStore.add('Удаление выбора', XMark);
	};

	const gotoChoiceToFrame = () => {
		const gotoFrame = find(boardFramesStore.frames, { frameId: choice.frameId! });

		if (!gotoFrame) {
			return;
		}

		setSelectedFrame(gotoFrame);
		descriptionFocus();
	};

	const descriptionFocus = () => {
		const descriptionInputs = document
			.getElementById('description')
			?.querySelectorAll('[contenteditable]');

		if (!descriptionInputs) return;

		(descriptionInputs[0] as HTMLContentEditable).focus();
	};

	const handleOpenModificatorsPanel = () => {
		panelStatesStore.set<{
			choiceId: number;
			frameId: number;
		}>(`modificators-${choice.choiceId}`, Modificators, {
			choiceId: choice.choiceId,
			frameId: frame.frameId,
			isEdit: true,
			isSubpanel: true,
			title: 'Модификаторы'
		});
	};

	const addFrameFromChoice = () => {
		const distance = 40;
		const { x, y } = frame;
		const choiceKey = findIndex(frame.choices, { choiceId: choice.choiceId });
		const lastFrameId = addFrame({
			x: x + DEFAULT_BLOCK_WIDTH + distance,
			y: y + (DEFAULT_FRAME_HEIGHT + distance) * choiceKey - DEFAULT_FRAME_HEIGHT / 2
		});
		const newFrame = find(boardFramesStore.frames, { frameId: lastFrameId + 1 })!;

		choice.frameId = newFrame.frameId;

		setSelectedFrame(newFrame);
		descriptionFocus();
	};

	let greenBackgroundColor = $derived(
		currentThemeClass(clm('bg-emerald-800'), clm('bg-emerald-200'))
	);

	let logicModificators = $derived(
		choiceModificators(frame.modificators, choice.choiceId, 'logic')
	);
	let mathModificators = $derived(choiceModificators(frame.modificators, choice.choiceId, 'math'));
</script>

<Contenteditable
	bind:html={choice.text}
	class="shrink grow"
	disabled={panelStatesStore.editMode}
	oninput={boardEventsStore.save}
	maxlength={100}
	placeholder="Вариант выбора"
	readonly={readonlyModeStore.isEnabled}
>
	{#snippet left()}
		<Button
			size="sm"
			class={clm(
				'bg-contrast-9 text-text',
				logicModificators.length || mathModificators.length
					? 'text-white hover:opacity-70'
					: 'hover:bg-contrast-7',
				logicModificators.length && 'bg-orange-500',
				mathModificators.length && 'bg-blue-500',
				mathModificators.length &&
					logicModificators.length &&
					'bg-gradient-to-br from-orange-500 from-50% to-blue-500 to-50%'
			)}
			onclick={handleOpenModificatorsPanel}
		>
			<Icon this={choice.asInput ? AsInput : Beaker} class="size-4" />
		</Button>
	{/snippet}
	{#snippet right()}
		{#if panelStatesStore.editMode}
			<Button size="sm" class={redBackgroundColorStore.color} onclick={removeChoice}>
				<Icon this={XMark} class="size-4" />
			</Button>
		{:else if choice.frameId || readonlyModeStore.isEnabled}
			<Button
				disabled={!choice.frameId}
				size="sm"
				class="bg-contrast-9 text-text hover:bg-contrast-7"
				onclick={gotoChoiceToFrame}
			>
				<Icon class="size-4" this={ChevronRight} />
			</Button>
		{:else}
			<Button
				size="sm"
				class={clm(greenBackgroundColor, 'text-emerald-500')}
				onclick={addFrameFromChoice}
			>
				<Icon class="size-4" this={Plus} />
			</Button>
		{/if}
	{/snippet}
</Contenteditable>
