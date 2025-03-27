<script lang="ts">
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import reject from 'lodash/reject';
	import { Beaker, ChevronRight, Plus, XMark } from 'svelte-heros-v2';

	import AsInput from '$lib/components/Icons/AsInput.svelte';
	import { DEFAULT_BLOCK_WIDTH, DEFAULT_FRAME_HEIGHT } from '$lib/constants';
	import { currentThemeClass, redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { Choice, Frame } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Contenteditable from '$lib/ui/Contenteditable.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { choiceModificators } from '$lib/utils/variableOperations';

	import { addFrame, setSelectedFrame } from '$board/components/methods.svelte';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { boardEventsStore, readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import Modificators from '../Modificators/index.svelte';

	type HTMLContentEditable = HTMLDivElement;

	const {
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

	const greenBackgroundColor = $derived(
		currentThemeClass(
			clm('bg-emerald-800 text-emerald-500 ring-emerald-700'),
			clm('bg-emerald-200 text-emerald-500 ring-emerald-300')
		)
	);

	const logicModificators = $derived(
		choiceModificators(frame.modificators, choice.choiceId, 'logic')
	);
	const mathModificators = $derived(
		choiceModificators(frame.modificators, choice.choiceId, 'math')
	);
	const hasAllModificators = $derived(logicModificators.length && mathModificators.length);
</script>

<Contenteditable
	bind:html={choice.text}
	class={clm(button.size.base, 'p-1')}
	disabled={panelStatesStore.editMode}
	oninput={boardEventsStore.save}
	maxlength={100}
	placeholder="Вариант выбора"
	readonly={readonlyModeStore.isEnabled}
>
	{#snippet left()}
		<Button
			class={clm(
				button.size.sm,
				button.type.primary,
				'px-1.5',
				hasAllModificators
					? 'bg-gradient-to-br from-orange-500/30 to-blue-500/30 text-violet-500 ring-violet-500/50 hover:from-orange-500/40 hover:to-blue-500/40'
					: logicModificators.length
						? 'bg-orange-500/20 text-orange-500 ring-orange-500/50 hover:bg-orange-500/30'
						: mathModificators.length &&
							'bg-blue-500/20 text-blue-500 ring-blue-500/50 hover:bg-blue-500/30'
			)}
			onclick={handleOpenModificatorsPanel}
		>
			<Icon this={choice.asInput ? AsInput : Beaker} class="size-5" />
		</Button>
	{/snippet}
	{#snippet right()}
		{#if panelStatesStore.editMode}
			<Button
				class={clm(button.size.sm, button.type.primary, redBackgroundColorStore.color, 'px-1.5')}
				onclick={removeChoice}
			>
				<Icon this={XMark} class="size-5" />
			</Button>
		{:else if choice.frameId || readonlyModeStore.isEnabled}
			<Button
				disabled={!choice.frameId}
				class={clm(button.size.sm, button.type.primary, 'px-1.5')}
				onclick={gotoChoiceToFrame}
			>
				<Icon class="size-5" this={ChevronRight} />
			</Button>
		{:else}
			<Button
				class={clm(button.size.sm, button.type.primary, greenBackgroundColor, 'px-1.5')}
				onclick={addFrameFromChoice}
			>
				<Icon class="size-5" this={Plus} />
			</Button>
		{/if}
	{/snippet}
</Contenteditable>
