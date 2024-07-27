<script lang="ts">
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import find from 'lodash/find';
	import { PencilSquare, XMark } from 'svelte-heros-v2';
	import { Button, FormSplit, Icon, Input, Listbox } from 'treetale-ui';

	import type {
		Choice,
		ComparisonOperators,
		LogicOperation,
		MathOperation,
		MathOperators
	} from '$lib/types';

	import { currentThemeClass, redBackgroundColorStore } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';

	type ModificatorType = 'logic' | 'math';

	let {
		choice
	}: {
		choice: Choice;
	} = $props();

	const symbols: {
		logic: ComparisonOperators[];
		math: MathOperators[];
	} = {
		logic: ['=', '≥', '≤', '>', '<', '≠'],
		math: ['+', '-', '*', '/', '=']
	};

	let editMode = $state(false);
	let activeModificator = $state<ModificatorType>('logic');

	const switchEditMode = () => {
		editMode = !editMode;
	};

	const clearLiberties = (readonly: boolean) => {
		if (!readonly) return;

		editMode = false;
	};

	const handleSelectVariable = (key: number, name: string) => {
		const { expect } = find(variablesStore.variables, { name })!;

		if (expect === 'Логика') {
			if (!['Да', 'Нет'].includes(operations[key].value)) {
				operations[key].value = 'Да';
			}
		}

		if (expect !== 'Число') {
			operations[key].symbol = '=';
		}

		handleChange();
	};

	const handleChange = () => {
		boardFramesStore.frames = boardFramesStore.frames;
	};

	const handleAddModificator = () => {
		(choice[operationsKey] as (LogicOperation | MathOperation)[]).push({
			symbol: symbols[activeModificator][0],
			value: '',
			variable: ''
		});
	};

	const handleRemoveModificator = (key: number) => {
		choice[operationsKey].splice(key, 1);
	};

	$effect(() => {
		clearLiberties(readonlyModeStore.isEnabled);
	});

	let operationsKey = $derived(
		(activeModificator + 'Operations') as 'logicOperations' | 'mathOperations'
	);
	let operations = $derived(choice[operationsKey]);
	let orangeBackgroundColor = $derived(
		currentThemeClass(clm('bg-orange-950'), clm('bg-orange-200'))
	);
	let violetBackgroundColor = $derived(
		currentThemeClass(clm('bg-violet-950'), clm('bg-violet-200'))
	);
</script>

<div
	class="relative flex select-none flex-col items-center gap-1 rounded-lg bg-contrast-3 p-1 text-sm"
>
	<div class="relative flex w-full justify-start">
		<FormSplit>
			<Button
				size="sm"
				class={clm(
					'bg-contrast-9 hover:bg-contrast-7',
					activeModificator === 'logic' && clm(orangeBackgroundColor, 'text-orange-500')
				)}
				onclick={() => (activeModificator = 'logic')}
			>
				Условия появления
			</Button>
			<Button
				size="sm"
				class={clm(
					'bg-contrast-9 hover:bg-contrast-7',
					activeModificator === 'math' && clm(violetBackgroundColor, 'text-violet-500')
				)}
				onclick={() => (activeModificator = 'math')}
			>
				Изменение переменных
			</Button>
		</FormSplit>
		{#if !readonlyModeStore.isEnabled}
			<Button
				size="sm"
				class={clm(
					'absolute right-0 z-[2] bg-contrast-9 text-text hover:bg-contrast-7',
					editMode && 'text-red-500'
				)}
				onclick={switchEditMode}
			>
				<Icon class="size-4" this={PencilSquare} />
			</Button>
		{/if}
	</div>
	<div class="flex w-full flex-col gap-1">
		{#each operations as operation, key}
			{#if editMode}
				{@const value = `${operation.variable || 'Переменная'} ${operation.symbol} ${
					operation.value || 'Значение'
				}`}
				<Input placeholder="Значение" readonly {value}>
					{#snippet right()}
						<Button
							size="sm"
							class={clm('text-red-500', redBackgroundColorStore.color)}
							onclick={() => handleRemoveModificator(key)}
						>
							<Icon class="size-4" this={XMark} />
						</Button>
					{/snippet}
				</Input>
			{:else}
				{@const variable = find(variablesStore.variables, { name: operation.variable })}
				<div class="flex flex-wrap gap-1 rounded-lg bg-contrast/80">
					<Listbox
						bind:value={operation.variable}
						class="flex-1"
						list={variablesStore.variables.map(({ name }) => name)}
						onchange={(value) => handleSelectVariable(key, value)}
						placeholder="Переменная"
						readonly={readonlyModeStore.isEnabled}
					/>
					<Listbox
						align="center"
						bind:value={operation.symbol}
						list={symbols[activeModificator]}
						onchange={handleChange}
						placeholder=""
						readonly={readonlyModeStore.isEnabled}
					>
						{#snippet children({ onclick, value })}
							<Button
								class="bg-contrast-9 text-text hover:bg-contrast-7"
								disabled={variable?.expect !== 'Число'}
								{onclick}
							>
								{value}
							</Button>
						{/snippet}
					</Listbox>
					{#if variable?.expect !== 'Логика'}
						<Input
							bind:value={operation.value}
							class="flex-1"
							maxlength={32}
							number={variable?.expect === 'Число'}
							oninput={handleChange}
							placeholder="Значение"
							readonly={readonlyModeStore.isEnabled}
						/>
					{:else}
						<Listbox
							align="inset"
							bind:value={operation.value}
							class="flex-1"
							list={[{ title: 'Да' }, { title: 'Нет' }]}
							onchange={handleChange}
							placeholder="Значение"
							readonly={readonlyModeStore.isEnabled}
						/>
					{/if}
				</div>
			{/if}
		{/each}
		{#if !editMode && !readonlyModeStore.isEnabled}
			<Button
				class="w-full justify-center bg-contrast-9 text-text hover:bg-contrast-7"
				onclick={handleAddModificator}
			>
				{activeModificator === 'logic' ? 'Добавить условие' : 'Добавить переменную'}
			</Button>
		{/if}
	</div>
</div>
