<script lang="ts">
	import find from 'lodash/find';
	import { XMark } from 'svelte-heros-v2';

	import AsInput from '$lib/components/Icons/AsInput.svelte';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { ComparisonOperators, MathOperators, Modificator } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Input from '$lib/ui/Input.svelte';
	import Listbox from '$lib/ui/Listbox.svelte';
	import { button } from '$lib/ui/presets';
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
		const id = find(variablesStore.variables, { name: value })!.id; // Временно!
		selectVariable(id);
		boardEventsStore.save();
	};

	const selectVariable = (id: number) => {
		const { expect } = find(variablesStore.variables, { id })!;

		modificator.variableId = id;

		if (expect === 'Логика') {
			if (!['Да', 'Нет'].includes(modificator.value)) {
				modificator.value = 'Да';
			}
		}

		if (expect !== 'Число') {
			modificator.symbol = '=';
		}
	};

	const variable = $derived(
		modificator.variableId !== null
			? find(variablesStore.variables, { id: modificator.variableId })
			: null
	);
	const fullModificatorOperation = $derived(
		`${variable?.name || 'Переменная'} ${modificator.symbol} ${modificator.value || 'Значение'}`
	);
	const isFieldForInputVar = $derived(
		modificator.type === 'math' && asInput && !modificator.value && variable?.expect === 'Строка'
	);
	const onlyFilledVariables = $derived(
		variablesStore.variables.filter((variable) => variable.name)
	);
</script>

{#snippet inputValue()}
	{#if variable?.expect === 'Логика'}
		<Listbox
			value={modificator.value}
			onchange={(value) => {
				modificator.value = value;
				boardEventsStore.save();
			}}
			class="flex-1"
			options={[{ value: 'Да' }, { value: 'Нет' }]}
			placeholder="Значение"
			readonly={readonlyModeStore.isEnabled}
		/>
	{:else}
		<Input
			bind:value={modificator.value}
			class={clm(
				button.size.base,
				'flex-1',
				isFieldForInputVar && 'py-1 pr-1',
				asInput &&
					modificator.value === '{input}' &&
					'bg-violet-500/10 text-violet-500 ring-violet-500/30 hover:bg-violet-500/20'
			)}
			maxlength={32}
			oninput={boardEventsStore.save}
			number={variable?.expect === 'Число'}
			placeholder="Значение"
			disabled={!variable}
			readonly={readonlyModeStore.isEnabled}
		>
			{#snippet right()}
				{#if isFieldForInputVar}
					<Button
						class={clm(button.type.primary, button.size.sm, 'px-1.5')}
						onclick={() => (modificator.value = '{input}')}
					>
						<Icon this={AsInput} class="size-5" />
					</Button>
				{/if}
			{/snippet}
		</Input>
	{/if}
{/snippet}

{#if panelStatesStore.editMode}
	<Input
		placeholder="Значение"
		readonly
		class={clm(button.size.base, 'grow py-1 pr-1')}
		disabled
		value={fullModificatorOperation}
	>
		{#snippet right()}
			<Button
				class={clm(button.type.primary, button.size.sm, redBackgroundColorStore.color, 'px-1.5')}
				onclick={onremove}
			>
				<Icon class="size-5" this={XMark} />
			</Button>
		{/snippet}
	</Input>
{:else}
	<div class="grid grid-cols-[1fr_max-content_1fr] gap-2">
		<Listbox
			value={variable?.name}
			class="flex-1"
			options={onlyFilledVariables.map(({ name }) => ({ value: name }))}
			onchange={handleChange}
			placeholder="Переменная"
			readonly={readonlyModeStore.isEnabled}
		/>
		<Listbox
			value={modificator.symbol as string}
			options={symbols[modificator.type].map((value) => ({ value }))}
			placeholder=""
			class="w-8"
			hideArrow
			sameWidth={false}
			onchange={(value) => {
				modificator.symbol = value as Modificator['symbol'];
				boardEventsStore.save();
			}}
			readonly={readonlyModeStore.isEnabled}
		/>
		{@render inputValue()}
	</div>
{/if}
