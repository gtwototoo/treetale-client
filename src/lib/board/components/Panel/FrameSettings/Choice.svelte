<script lang="ts">
	import { addFrame, setSelectedFrame } from '$board/components/methods.svelte';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import reject from 'lodash/reject';
	import { Beaker, ChevronRight, Plus, XMark } from 'svelte-heros-v2';
	import { Button, Contenteditable, FormSplit, Icon } from 'treetale-ui';

	import type { Choice, Frame } from '$lib/types';

	import { DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { currentThemeClass, redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	import Modificators from './Modificators.svelte';

	type HTMLContentEditable = HTMLDivElement;

	let {
		choice,
		frame
	}: {
		choice: Choice;
		frame: Frame;
	} = $props();

	let showModificators = $state(false);

	const switchShow = () => {
		showModificators = !showModificators;
	};

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

	const addFrameFromChoice = () => {
		const distance = 40;
		const { x, y } = frame;
		const choiceKey = findIndex(frame.choices, { choiceId: choice.choiceId });
		const lastFrameId = addFrame({
			x: x + DEFAULT_FRAME_SIZE.width + distance,
			y: y + (DEFAULT_FRAME_SIZE.height + distance) * choiceKey - DEFAULT_FRAME_SIZE.height / 2
		});
		const newFrame = find(boardFramesStore.frames, { frameId: lastFrameId + 1 })!;

		choice.frameId = newFrame.frameId;

		setSelectedFrame(newFrame);
		descriptionFocus();
	};

	let greenBackgroundColor = $derived(
		currentThemeClass(clm('bg-emerald-800'), clm('bg-emerald-200'))
	);
</script>

<FormSplit vertical>
	<Contenteditable
		bind:html={choice.text}
		class="shrink grow"
		disabled={panelStatesStore.editMode}
		maxlength={100}
		placeholder="Вариант выбора"
		readonly={readonlyModeStore.isEnabled}
	>
		{#snippet left()}
			<Button
				size="sm"
				class={clm(
					'gap-1 bg-contrast-9 text-text',
					showModificators && 'bg-violet-500 text-white',
					!showModificators &&
						(choice.logicOperations.length || choice.mathOperations.length) &&
						'text-violet-500'
				)}
				onclick={switchShow}
			>
				<Icon class="size-4" this={Beaker} />
			</Button>
		{/snippet}
		{#snippet right()}
			{#if panelStatesStore.editMode}
				<Button
					size="sm"
					class={clm('text-red-500', redBackgroundColorStore.color)}
					onclick={removeChoice}
				>
					<Icon this={XMark} class="size-4" />
				</Button>
			{:else if choice.frameId}
				<Button size="sm" class="bg-contrast-9 text-text" onclick={gotoChoiceToFrame}>
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
	{#if showModificators}
		<Modificators {choice} />
	{/if}
</FormSplit>
