<script lang="ts">
	import find from 'lodash/find';
	import { XMark } from 'svelte-heros-v2';
	import { Button, FormSplit, Icon, Input, Listbox } from 'treetale-ui';

	import AsInput from '$lib/components/Icons/AsInput.svelte';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { ComparisonOperators, MathOperators, Modificator } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';

	import { boardEventsStore, readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';

	const symbols: {
		logic: ComparisonOperators[];
		math: MathOperators[];
	} = {
		logic: ['=', '≥', '≤', '>', '<', '≠'],
		math: ['+', '-', '*', '/', '=']
	};

	const {
		asInput,
		modificator,
		onremove
	}: {
		asInput?: boolean;
		modificator: Modificator;
		onremove?: () => void;
	} = $props();

	const handleChange = (value: string) => {
		selectVariable(value);
		boardEventsStore.save();
	};

	const selectVariable = (name: string) => {
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

	const variable = $derived(find(variablesStore.variables, { name: modificator.variable }));
	const fullModificatorOperation = $derived(
		`${modificator.variable || 'Переменная'} ${modificator.symbol} ${modificator.value || 'Значение'}`
	);
</script>

{#snippet inputValue()}
	{#if variable?.expect === 'Логика'}
		<Listbox
			size="sm"
			align="inset"
			bind:value={modificator.value}
			onchange={boardEventsStore.save}
			class="flex-1"
			list={['Да', 'Нет']}
			placeholder="Значение"
			readonly={readonlyModeStore.isEnabled}
		/>
	{:else}
		<FormSplit>
			<Input
				size="sm"
				bind:value={modificator.value}
				class={clm(
					'flex-1 bg-contrast-4',
					asInput &&
						modificator.value === '{input}' &&
						'bg-violet-500/30 text-violet-500 hover:bg-violet-500/40'
				)}
				maxlength={32}
				oninput={boardEventsStore.save}
				number={variable?.expect === 'Число'}
				placeholder="Значение"
				disabled={!modificator.variable}
				readonly={readonlyModeStore.isEnabled}
			/>
			{#if modificator.type === 'math' && asInput && !modificator.value && variable?.expect === 'Строка'}
				<Button
					size="sm"
					class="bg-contrast-9 text-text hover:bg-contrast-7"
					onclick={() => (modificator.value = '{input}')}
				>
					<Icon this={AsInput} class="size-4" />
				</Button>
			{/if}
		</FormSplit>
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
			onchange={handleChange}
			placeholder="Переменная"
			readonly={readonlyModeStore.isEnabled}
		/>
		<Listbox
			align="inset"
			size="sm"
			classlist={clm('*:*:justify-center')}
			bind:value={modificator.symbol as string}
			list={symbols[modificator.type]}
			placeholder=""
			onchange={boardEventsStore.save}
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
