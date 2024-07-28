<script lang="ts">
	import type {
		ComparisonOperators,
		LogicOperation,
		MathOperation,
		MathOperators
	} from '$board/types';

	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import find from 'lodash/find';
	import { XMark } from 'svelte-heros-v2';
	import { Button, Icon, Input, Listbox } from 'treetale-ui';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

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
		onremove,
		operation
	}: {
		modificator: Modificator;
		onremove?: () => void;
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
	let fullOperationValue = $derived(
		`${operation.variable || 'Переменная'} ${operation.symbol} ${operation.value || 'Значение'}`
	);
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

{#if panelStatesStore.editMode}
	<div class="flex gap-1">
		<Input placeholder="Значение" size="sm" readonly class="w-full" value={fullOperationValue} />
		<Button
			size="sm"
			class={clm('text-red-500', redBackgroundColorStore.color)}
			onclick={onremove}
		>
			<Icon class="size-4" this={XMark} />
		</Button>
	</div>
{:else}
	<div class="flex flex-wrap gap-1 rounded-lg bg-contrast/80">
		<Listbox
			size="sm"
			align="inset"
			bind:value={operation.variable}
			class="flex-1"
			list={variablesStore.variables.map(({ name }) => name)}
			onchange={(value) => handleSelectVariable(value)}
			placeholder="Переменная"
			readonly={readonlyModeStore.isEnabled}
		/>
		<Listbox
			align="inset"
			size="sm"
			classlist={clm('*:*:justify-center')}
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
{/if}
