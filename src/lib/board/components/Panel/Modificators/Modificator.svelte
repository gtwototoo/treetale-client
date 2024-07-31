<script lang="ts">
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import find from 'lodash/find';
	import { XMark } from 'svelte-heros-v2';
	import { Button, Icon, Input, Listbox } from 'treetale-ui';

	import type { ComparisonOperators, MathOperators, Modificator } from '$lib/types';

	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	const symbols: {
		logic: ComparisonOperators[];
		math: MathOperators[];
	} = {
		logic: ['=', '≥', '≤', '>', '<', '≠'],
		math: ['+', '-', '*', '/', '=']
	};

	let {
		modificator,
		onremove
	}: {
		modificator: Modificator;
		onremove?: () => void;
	} = $props();

	const handleSelectVariable = (name: string) => {
		const { expect } = find(variablesStore.variables, { name })!;

		if (expect === 'Логика') {
			if (!['Да', 'Нет'].includes(modificator.value)) {
				modificator.value = 'Да';
			}
		}

		if (expect !== 'Число') {
			modificator.symbol = '=';
		}
	};

	let variable = $derived(find(variablesStore.variables, { name: modificator.variable }));
	let fullModificatorOperation = $derived(
		`${modificator.variable || 'Переменная'} ${modificator.symbol} ${modificator.value || 'Значение'}`
	);
</script>

{#snippet inputValue()}
	{#if variable?.expect !== 'Логика'}
		<Input
			size="sm"
			bind:value={modificator.value}
			class="flex-1 bg-contrast-4"
			maxlength={32}
			number={variable?.expect === 'Число'}
			placeholder="Значение"
			disabled={modificator.variable === ''}
			readonly={readonlyModeStore.isEnabled}
		/>
	{:else}
		<Listbox
			size="sm"
			align="inset"
			bind:value={modificator.value}
			class="flex-1"
			list={[{ title: 'Да' }, { title: 'Нет' }]}
			placeholder="Значение"
			readonly={readonlyModeStore.isEnabled}
		/>
	{/if}
{/snippet}

{#if panelStatesStore.editMode}
	<div class="flex gap-1">
		<Input
			placeholder="Значение"
			size="sm"
			readonly
			class="w-full"
			value={fullModificatorOperation}
		/>
		<Button size="sm" class={redBackgroundColorStore.color} onclick={onremove}>
			<Icon class="size-4" this={XMark} />
		</Button>
	</div>
{:else}
	<div class="grid grid-cols-[1fr,max-content,1fr] gap-1">
		<Listbox
			size="sm"
			align="inset"
			bind:value={modificator.variable}
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
			bind:value={modificator.symbol}
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
