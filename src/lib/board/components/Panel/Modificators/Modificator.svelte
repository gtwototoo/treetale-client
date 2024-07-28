<script lang="ts">
	import type { LogicOperation, MathOperation, PanelProps } from '$board/types';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import find from 'lodash/find';
	import { Button, FormSplit, Listbox } from 'treetale-ui';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	import Operation from './Operation.svelte';

	interface Modificator {
		operations: LogicOperation[] | MathOperation[];
		type: 'logic' | 'math';
	}

	let {
		modificator,
		onremove
	}: {
		modificator: Modificator;
		onremove?: () => void;
	} = $props();

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

	const handleRemoveOperation = (key: number) => {
		modificator.operations.splice(key, 1);
	};

	let frame = $derived(
		find(boardFramesStore.frames, {
			frameId: (panelStatesStore.props as { frameId: number } & PanelProps).frameId
		})!
	);
</script>

<div class="flex flex-col gap-2 rounded-xl bg-contrast-3 p-2">
	<Listbox
		placeholder="Вариант выбора"
		list={frame.choices.map(({ text }) => text)}
		disabled={panelStatesStore.editMode}
		readonly={readonlyModeStore.isEnabled}
	/>
	{#if panelStatesStore.editMode}
		<Button disabled class="justify-center bg-contrast-9 text-text">
			{modificator.type === 'logic' ? 'Условие' : 'Операция'}
		</Button>
	{:else}
		<FormSplit class="w-full *:flex-1">
			<Button
				onclick={() => selectType('logic')}
				class={clm(
					'justify-center bg-contrast-7',
					modificator.type === 'logic' && 'bg-main text-text',
					readonlyModeStore.isEnabled && 'pointer-events-none'
				)}
			>
				Условие
			</Button>
			<Button
				onclick={() => selectType('math')}
				class={clm(
					'justify-center bg-contrast-7',
					modificator.type === 'math' && 'bg-main text-text',
					readonlyModeStore.isEnabled && 'pointer-events-none'
				)}
			>
				Операция
			</Button>
		</FormSplit>
	{/if}
	<div class="flex w-full flex-col gap-1">
		{#if !readonlyModeStore.isEnabled || (readonlyModeStore.isEnabled && modificator.operations.length)}
			{#each modificator.operations as operation, key}
				<Operation {operation} {modificator} onremove={() => handleRemoveOperation(key)} />
			{/each}
		{:else}
			<p class="p-2 text-center text-sm text-gray-500">
				Нет {modificator.type === 'logic' ? 'условий' : 'операций'}
			</p>
		{/if}
		{#if !panelStatesStore.editMode && !readonlyModeStore.isEnabled}
			<Button
				size="sm"
				class="w-full justify-center bg-contrast-9 text-text hover:bg-contrast-7"
				onclick={handleAddOperation}
			>
				{modificator.type === 'logic' ? 'Добавить условие' : 'Добавить операцию'}
			</Button>
		{/if}
		{#if panelStatesStore.editMode}
			<Button
				size="sm"
				class={clm('w-full justify-center text-red-500', redBackgroundColorStore.color)}
				onclick={onremove}
			>
				Удалить модификатор
			</Button>
		{/if}
	</div>
</div>
