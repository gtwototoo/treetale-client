<script lang="ts">
	import type { LogicOperation, MathOperation, PanelProps } from '$board/types';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import find from 'lodash/find';
	import { Button, FormSplit, Listbox } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	import Operation from './Operation.svelte';

	interface Modificator {
		operations: LogicOperation[] | MathOperation[];
		type: 'logic' | 'math';
	}

	const selectType = (type: 'logic' | 'math') => {
		modificator.type = type;
	};

	const handleAddOperation = () => {
		modificator.operations.push({
			symbol: '=',
			value: '',
			variable: ''
		});
	};

	let {
		modificator
	}: {
		modificator: Modificator;
	} = $props();

	let frame = $derived(
		find(boardFramesStore.frames, {
			frameId: (panelStatesStore.props as { frameId: number } & PanelProps).frameId
		})!
	);
</script>

<div class="flex flex-col gap-2 rounded-xl bg-contrast-3 p-2">
	<Listbox placeholder="Вариант выбора" list={frame.choices.map(({ text }) => text)} />
	<FormSplit class="w-full *:flex-1">
		<Button
			onclick={() => selectType('logic')}
			class={clm(
				'justify-center bg-contrast-7',
				modificator.type === 'logic' && 'bg-main text-text'
			)}
		>
			Условие
		</Button>
		<Button
			onclick={() => selectType('math')}
			class={clm(
				'justify-center bg-contrast-7',
				modificator.type === 'math' && 'bg-main text-text'
			)}
		>
			Операция
		</Button>
	</FormSplit>
	<div class="flex w-full flex-col gap-1">
		{#each modificator.operations as operation}
			<Operation {operation} {modificator} />
		{/each}
		{#if !panelStatesStore.editMode && !readonlyModeStore.isEnabled}
			<Button
				size="sm"
				class="w-full justify-center bg-contrast-9 text-text hover:bg-contrast-7"
				onclick={handleAddOperation}
			>
				{modificator.type === 'logic' ? 'Добавить условие' : 'Добавить операцию'}
			</Button>
		{/if}
	</div>
</div>
