<script lang="ts">
	import clsx from 'clsx';
	import { PencilSquare, XMark } from 'svelte-heros-v2';

	import type {
		ILogicOperation,
		IMathOperation,
		TComparisonOperator,
		TMathOperator
	} from '$lib/types';

	import { Button, FormSplit, Input, Listbox } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore, variablesStore } from '$lib/stores/editing';
	import { bodyColorStore, redColorStore } from '$lib/stores/main';
	import { framesDataStore } from '$lib/stores/workspace';
	import { contrastText } from '$lib/utils';

	type TModificator = 'logic' | 'math';

	let className = '';
	export { className as class };

	export let frameKey: number;
	export let choiceKey: number;

	const symbols: {
		logic: Array<TComparisonOperator>;
		math: Array<TMathOperator>;
	} = {
		logic: ['=', '≥', '≤', '>', '<', '≠'],
		math: ['+', '-', '*', '/', '=']
	};

	let editMode = false;
	let active: TModificator = 'logic';

	const switchEditMode = () => {
		editMode = !editMode;
	};

	const clearLiberties = (readonly: boolean) => {
		if (!readonly) return;

		editMode = false;
	};

	const handleSelectVariable = (key: number, variableName: string) => {
		const variable = $variablesStore.find(({ name }) => name === variableName);

		if (variable.expect === 'Да/Нет') {
			if (!['Да', 'Нет'].includes(operations[key].value)) {
				operations[key].value = 'Да';
			}
		}

		if (variable.expect !== 'Число') {
			operations[key].symbol = '=';
		}

		handleChange();
	};

	const handleChange = () => {
		$framesDataStore = $framesDataStore;
	};

	const handleAddModificator = () => {
		($framesDataStore[frameKey].choices[choiceKey][operationsKey] as Array<
			ILogicOperation | IMathOperation
		>) = [
			{
				symbol: symbols[active][0],
				value: '',
				variable: ''
			},
			...$framesDataStore[frameKey].choices[choiceKey][operationsKey]
		];
	};

	const handleRemoveModificator = (key: number) => {
		$framesDataStore[frameKey].choices[choiceKey][operationsKey].splice(key, 1);

		($framesDataStore[frameKey].choices[choiceKey][operationsKey] as Array<
			ILogicOperation | IMathOperation
		>) = [...$framesDataStore[frameKey].choices[choiceKey][operationsKey]];
	};

	$: clearLiberties($readonlyStore);
	$: operationsKey = (active + 'Operations') as 'logicOperations' | 'mathOperations';
	$: operations = $framesDataStore[frameKey].choices[choiceKey][operationsKey];
	$: orangeBackground = contrastText($bodyColorStore)
		? clsx('!bg-orange-950')
		: clsx('!bg-orange-200');
	$: violetBackground = contrastText($bodyColorStore)
		? clsx('!bg-violet-950')
		: clsx('!bg-violet-200');
</script>

<div
	class={clsx(
		'relative flex select-none flex-col items-center gap-2 rounded-lg bg-contrast-3 p-2 text-sm',
		className
	)}
>
	<div class="relative flex w-full justify-start">
		<FormSplit>
			<Button
				class={clsx(
					'bg-contrast-9',
					active === 'logic' && clsx(orangeBackground, 'text-orange-500')
				)}
				on:click={() => (active = 'logic')}
				size="sm"
				variant="ghost"
			>
				Условия появления
			</Button>
			<Button
				class={clsx(
					'bg-contrast-9',
					active === 'math' && clsx(violetBackground, 'text-violet-500')
				)}
				on:click={() => (active = 'math')}
				size="sm"
				variant="ghost"
			>
				Изменение переменных
			</Button>
		</FormSplit>
		{#if !$readonlyStore}
			<Button
				class={clsx(
					'!absolute right-0 z-[2] bg-contrast-9 !px-1 text-text',
					editMode && 'text-red-500'
				)}
				on:click={switchEditMode}
				size="sm"
				variant="ghost"
			>
				<Icon class="size-4" type={PencilSquare} />
			</Button>
		{/if}
	</div>
	<div class="flex w-full flex-col gap-2">
		<FormSplit vertical>
			{#each operations as operation, key}
				{#if editMode}
					{@const value = `${operation.variable || 'Переменная'} ${operation.symbol} ${
						operation.value || 'Значение'
					}`}
					<Input placeholder="Значение" readonly {value}>
						<svelte:fragment slot="right">
							<Button
								class={clsx('!px-1 !text-red-500', $redColorStore)}
								on:click={() => handleRemoveModificator(key)}
								size="sm"
								variant="main"
							>
								<Icon class="size-4" type={XMark} />
							</Button>
						</svelte:fragment>
					</Input>
				{:else}
					{@const variable = $variablesStore.find(({ name }) => name === operation.variable)}
					<div class="flex flex-wrap gap-1 rounded-lg bg-contrast/80 p-2">
						<Listbox
							bind:value={operation.variable}
							class="flex-1"
							list={$variablesStore.map(({ name }) => name)}
							on:change={({ detail }) => handleSelectVariable(key, detail)}
							placeholder="Переменная"
							readonly={$readonlyStore}
							size="sm"
						/>
						<Listbox
							align="center"
							bind:value={operation.symbol}
							let:click
							let:value
							list={symbols[active]}
							on:change={handleChange}
							placeholder=""
							readonly={$readonlyStore}
						>
							<Button
								class="bg-contrast-9 text-text"
								disabled={variable?.expect !== 'Число'}
								on:click={click}
								size="sm"
								variant="ghost"
							>
								{value}
							</Button>
						</Listbox>
						{#if variable?.expect !== 'Да/Нет'}
							<Input
								bind:value={operation.value}
								class="flex-1"
								maxlength={32}
								number={variable?.expect === 'Число'}
								on:input={handleChange}
								placeholder="Значение"
								readonly={$readonlyStore}
								size="sm"
							/>
						{:else}
							<Listbox
								align="inset"
								bind:value={operation.value}
								class="flex-1"
								list={[{ title: 'Да' }, { title: 'Нет' }]}
								on:change={handleChange}
								placeholder="Значение"
								readonly={$readonlyStore}
								size="sm"
							/>
						{/if}
					</div>
				{/if}
			{/each}
		</FormSplit>
		{#if !editMode && !$readonlyStore}
			<Button
				class="w-full justify-center bg-contrast-9 text-text"
				on:click={handleAddModificator}
				variant="ghost"
			>
				{active === 'logic' ? 'Добавить условие' : 'Добавить переменную'}
			</Button>
		{/if}
	</div>
</div>
