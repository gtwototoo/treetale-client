<script lang="ts">
	import type {
		ComparisonOperators,
		LogicOperation,
		MathOperation,
		MathOperators
	} from '$board/types';

	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import find from 'lodash/find';
	import { Button, Input, Listbox } from 'treetale-ui';

	interface Modificator {
		operations: LogicOperation[] | MathOperation[];
		type: 'logic' | 'math';
	}

	const symbols: {
		logic: ComparisonOperators[];
		math: MathOperators[];
	} = {
		logic: ['=', '≥', '≤', '>', '<', '≠'],
		math: ['+', '-', '*', '/', '=']
	};

	let {
		modificator,
		operation
	}: {
		modificator: Modificator;
		operation: LogicOperation | MathOperation;
	} = $props();

	const handleSelectVariable = (name: string) => {
		const { expect } = find(variablesStore.variables, { name })!;

		if (expect === 'Логика') {
			if (!['Да', 'Нет'].includes(operation.value)) {
				operation.value = 'Да';
			}
		}

		if (expect !== 'Число') {
			operation.symbol = '=';
		}
	};

	let variable = $derived(find(variablesStore.variables, { name: operation.variable })!);
</script>

{#snippet inputValue()}
	{#if variable?.expect !== 'Логика'}
		<Input
			size="sm"
			bind:value={operation.value}
			class="flex-1"
			maxlength={32}
			number={variable?.expect === 'Число'}
			placeholder="Значение"
			disabled={operation.variable === ''}
			readonly={readonlyModeStore.isEnabled}
		/>
	{:else}
		<Listbox
			size="sm"
			align="inset"
			bind:value={operation.value}
			class="flex-1"
			list={[{ title: 'Да' }, { title: 'Нет' }]}
			placeholder="Значение"
			readonly={readonlyModeStore.isEnabled}
		/>
	{/if}
{/snippet}

<div class="flex flex-wrap gap-1 rounded-lg bg-contrast/80">
	<Listbox
		size="sm"
		bind:value={operation.variable}
		class="flex-1"
		list={variablesStore.variables.map(({ name }) => name)}
		onchange={(value) => handleSelectVariable(value)}
		placeholder="Переменная"
		readonly={readonlyModeStore.isEnabled}
	/>
	<Listbox
		align="center"
		size="sm"
		bind:value={operation.symbol}
		list={symbols[modificator.type]}
		placeholder=""
		readonly={readonlyModeStore.isEnabled}
	>
		{#snippet children({ onclick, value })}
			<Button
				size="sm"
				class="w-8 justify-center bg-contrast-9 text-text hover:bg-contrast-7"
				disabled={variable?.expect !== 'Число'}
				{onclick}
			>
				{value}
			</Button>
		{/snippet}
	</Listbox>
	{@render inputValue()}
</div>
