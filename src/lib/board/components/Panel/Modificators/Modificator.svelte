<script lang="ts">
	import find from 'lodash/find';
	import { XMark } from 'svelte-heros-v2';
	import { Button, Input } from 'treetale-ui';

	import AsInput from '$lib/components/Icons/AsInput.svelte';
	import { redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import type { ComparisonOperators, MathOperators, Modificator } from '$lib/types';
	import Icon from '$lib/ui/Icon.svelte';
	import Listbox from '$lib/ui/Listbox.svelte';
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
				'flex-1',
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
		>
			{#snippet right()}
				{#if modificator.type === 'math' && asInput && !modificator.value && modificator.variable && variable?.expect === 'Строка'}
					<Button
						size="sm"
						class="bg-main-300 text-text hover:bg-main-500"
						onclick={() => (modificator.value = '{input}')}
					>
						<Icon this={AsInput} class="size-4" />
					</Button>
				{/if}
			{/snippet}
		</Input>
	{/if}
{/snippet}

{#if panelStatesStore.editMode}
	<div class="flex gap-1">
		<Input placeholder="Значение" readonly class="w-full" value={fullModificatorOperation} />
		<Button size="sm" class={redBackgroundColorStore.color} onclick={onremove}>
			<Icon class="size-4" this={XMark} />
		</Button>
	</div>
{:else}
	<div class="grid grid-cols-[1fr_max-content_1fr] gap-1">
		<Listbox
			value={modificator.variable}
			class="flex-1"
			options={variablesStore.variables.map(({ name }) => ({ value: name }))}
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
