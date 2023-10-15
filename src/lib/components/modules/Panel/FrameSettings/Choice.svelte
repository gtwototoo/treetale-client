<script lang="ts">
	import { Button, FormSplit } from '$UI';
	import Contenteditable from '$UI/Contenteditable.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { changesHistory } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';
	import { framesDataStore } from '$lib/stores/workspace';
	import clsx from 'clsx';
	import { Variable, XMark } from 'svelte-heros-v2';
	import LogicOperations from './LogicOperations.svelte';
	import MathOperations from './MathOperations.svelte';

	type TModificator = 'logic' | 'math';

	export let choiceId: number;
	export let frameKey: number;

	$: choiceKey = $framesDataStore[frameKey].choices.findIndex(
		(choice) => choice.choiceId === choiceId
	);

	let active: TModificator;

	const setActiveOperation = (type: TModificator) => {
		active = type === active ? null : type;
	};

	const removeChoice = () => {
		$framesDataStore[frameKey].choices.filter((choice) => choice.choiceId !== choiceId);

		$framesDataStore[frameKey].choices = $framesDataStore[frameKey].choices.filter(
			(choice) => choice.choiceId !== choiceId
		);

		changesHistory.add('Удаление выбора', XMark);
	};

	$: editMode = $currentPanelStore.editMode;
	$: ({ logicOperations, mathOperations } = $framesDataStore[frameKey].choices[choiceKey]);
</script>

<FormSplit vertical={!editMode}>
	<Contenteditable
		class="grow"
		placeholder="Вариант выбора"
		disabled={editMode}
		bind:html={$framesDataStore[frameKey].choices[choiceKey].text}
	>
		<svelte:fragment slot="left">
			<Button
				size="sm"
				class={clsx(
					'text-xs gap-1',
					(logicOperations.length || active === 'logic') && '!bg-orange-100'
				)}
				on:click={() => setActiveOperation('logic')}
			>
				<p class="font-bold">if</p>
				{#if logicOperations.length}
					<p>{logicOperations.length}</p>
				{/if}
			</Button>
		</svelte:fragment>
		<svelte:fragment slot="right">
			<Button
				size="sm"
				class={clsx(
					'!px-1 gap-1',
					(mathOperations.length || active === 'math') && '!bg-violet-100'
				)}
				on:click={() => setActiveOperation('math')}
			>
				<Icon class="w-4 h-4" type={Variable} />
				{#if mathOperations.length}
					<p class="pr-1">
						{mathOperations.length}
					</p>
				{/if}
			</Button>
		</svelte:fragment>
	</Contenteditable>
	{#if editMode}
		<Button variant="main" class="!bg-red-100 !text-red-500" on:click={removeChoice}>
			<Icon type={XMark} />
		</Button>
	{:else if active === 'logic'}
		<LogicOperations {frameKey} {choiceKey} />
	{:else if active === 'math'}
		<MathOperations {frameKey} {choiceKey} />
	{/if}
</FormSplit>
