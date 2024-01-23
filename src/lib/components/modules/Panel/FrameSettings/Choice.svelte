<script lang="ts">
	import clsx from 'clsx';
	import { Beaker, ChevronRight, Plus, XMark } from 'svelte-heros-v2';

	import { Button, Contenteditable, FormSplit } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { DEFAULT_FRAME_SIZE } from '$lib/constants';
	import { readonlyStore } from '$lib/stores/editing';
	import { changesHistory } from '$lib/stores/history';
	import { bodyColorStore, currentPanelStore, redColorStore } from '$lib/stores/main';
	import { framesDataStore, selectedFrameStore } from '$lib/stores/workspace';
	import { contrastText, getFrameFromId } from '$lib/utils';
	import { addFrame, setSelectedFrame } from '../../Workspace/methods';
	import Modificators from './Modificators.svelte';

	type HTMLContentEditable = HTMLDivElement & ElementContentEditable;

	export let choiceId: number;
	export let frameKey: number;

	let showModificators = false;

	$: choiceKey = $framesDataStore[frameKey].choices.findIndex(
		(choice) => choice.choiceId === choiceId
	);

	const switchShow = () => {
		showModificators = !showModificators;
	};

	const removeChoice = () => {
		$framesDataStore[frameKey].choices = $framesDataStore[frameKey].choices.filter(
			(choice) => choice.choiceId !== choiceId
		);

		changesHistory.add('Удаление выбора', XMark);
	};

	const gotoChoiceToFrame = () => {
		const gotoFrame = getFrameFromId($framesDataStore, frameId);

		$selectedFrameStore = gotoFrame.frameId;

		setSelectedFrame(gotoFrame);
		descriptionFocus();
	};

	const descriptionFocus = () => {
		const descriptionInputs: NodeListOf<HTMLContentEditable> = document
			.getElementById('description')
			?.querySelectorAll('[contenteditable]');

		if (!descriptionInputs || $currentPanelStore.hidden) {
			return;
		}

		descriptionInputs[0].focus();
	};

	const addFrameFromChoice = () => {
		const distance = 40;
		const { x, y } = $framesDataStore[frameKey];
		const lastFrameId = addFrame({
			x: x + DEFAULT_FRAME_SIZE.width + distance,
			y: y + (DEFAULT_FRAME_SIZE.height + distance) * choiceKey - DEFAULT_FRAME_SIZE.height / 2
		});
		const newFrame = getFrameFromId($framesDataStore, lastFrameId + 1);

		$framesDataStore[frameKey].choices[choiceKey].frameId = newFrame.frameId;

		setSelectedFrame(newFrame);
		descriptionFocus();
	};

	$: editMode = $currentPanelStore.editMode;
	$: ({ frameId, logicOperations, mathOperations } =
		$framesDataStore[frameKey].choices[choiceKey]);
	$: greenBackground = contrastText($bodyColorStore)
		? clsx('bg-emerald-900')
		: clsx('bg-emerald-200');
</script>

<FormSplit vertical={!editMode}>
	<Contenteditable
		maxlength={100}
		class="!shrink grow"
		placeholder="Вариант выбора"
		disabled={editMode}
		readonly={$readonlyStore}
		bind:html={$framesDataStore[frameKey].choices[choiceKey].text}
	>
		<svelte:fragment slot="left">
			<Button
				size="sm"
				variant="ghost"
				class={clsx(
					'bg-contrast-9 gap-1 !p-1 text-xs text-text',
					showModificators && '!bg-violet-500 !text-white',
					!showModificators &&
						(logicOperations.length || mathOperations.length) &&
						'text-violet-500'
				)}
				on:click={switchShow}
			>
				<Icon class="h-4 w-4" type={Beaker} />
			</Button>
		</svelte:fragment>
		<svelte:fragment slot="right">
			{#if frameId}
				<Button
					size="sm"
					variant="ghost"
					class="bg-contrast-9 !px-1 text-text"
					on:click={gotoChoiceToFrame}
				>
					<Icon class="h-4 w-4" type={ChevronRight} />
				</Button>
			{:else}
				<Button
					size="sm"
					variant="ghost"
					class={clsx(greenBackground, '!px-1 text-emerald-500')}
					on:click={addFrameFromChoice}
				>
					<Icon class="h-4 w-4" type={Plus} />
				</Button>
			{/if}
		</svelte:fragment>
	</Contenteditable>
	{#if editMode}
		<Button variant="main" class={clsx('!text-red-500', $redColorStore)} on:click={removeChoice}>
			<Icon type={XMark} />
		</Button>
	{:else if showModificators}
		<Modificators {frameKey} {choiceKey} />
	{/if}
</FormSplit>
