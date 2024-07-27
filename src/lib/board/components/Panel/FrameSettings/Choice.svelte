<script lang="ts">
	import { addFrame, setSelectedFrame } from '$board/components/methods.svelte';
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { changesHistoryStore } from '$board/stores/history.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import reject from 'lodash/reject';
	import { ChevronRight, Plus, XMark } from 'svelte-heros-v2';
	import { Button, Contenteditable, Icon } from 'treetale-ui';

	import type { Choice, Frame } from '$lib/types';

	import { DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { currentThemeClass, redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

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

<Contenteditable
	bind:html={choice.text}
	class="shrink grow"
	disabled={panelStatesStore.editMode}
	maxlength={100}
	placeholder="Вариант выбора"
	readonly={readonlyModeStore.isEnabled}
>
	{#snippet right()}
		{#if panelStatesStore.editMode}
			<Button
				size="sm"
				class={clm('text-red-500', redBackgroundColorStore.color)}
				onclick={removeChoice}
			>
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
