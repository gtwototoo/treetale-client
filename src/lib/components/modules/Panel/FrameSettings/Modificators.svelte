<script lang="ts">
	import clsx from 'clsx';
	import { PencilSquare, XMark } from 'svelte-heros-v2';

	import { Button, Input, Listbox } from '$UI';
	import FormSplit from '$UI/FormSplit.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore, variablesStore } from '$lib/stores/editing';
	import { bodyColorStore, redColorStore } from '$lib/stores/main';
	import { framesDataStore } from '$lib/stores/workspace';
	import type {
		ILogicOperation,
		IMathOperation,
		TComparisonOperator,
		TMathOperator
	} from '$lib/types';
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
				variable: '',
				symbol: symbols[active][0],
				value: ''
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
		'bg-contrast-3 relative flex select-none flex-col items-center gap-2 rounded-lg p-2 text-sm',
		className
	)}
>
	<div class="relative flex w-full justify-start">
		<FormSplit>
			<Button
				size="sm"
				variant="ghost"
				class={clsx(
					'bg-contrast-9',
					active === 'logic' && clsx(orangeBackground, 'text-orange-500')
				)}
				on:click={() => (active = 'logic')}
			>
				Условия появления
			</Button>
			<Button
				size="sm"
				variant="ghost"
				class={clsx(
					'bg-contrast-9',
					active === 'math' && clsx(violetBackground, 'text-violet-500')
				)}
				on:click={() => (active = 'math')}
			>
				Изменение переменных
			</Button>
		</FormSplit>
		{#if !$readonlyStore}
			<Button
				size="sm"
				variant="ghost"
				class={clsx(
					'bg-contrast-9 !absolute right-0 z-[2] !px-1 text-text',
					editMode && 'text-red-500'
				)}
				on:click={switchEditMode}
			>
				<Icon type={PencilSquare} class="h-4 w-4" />
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
								variant="main"
								size="sm"
								on:click={() => handleRemoveModificator(key)}
								class={clsx('!px-1 !text-red-500', $redColorStore)}
							>
								<Icon type={XMark} class="h-4 w-4" />
							</Button>
						</svelte:fragment>
					</Input>
				{:else}
					{@const variable = $variablesStore.find(({ name }) => name === operation.variable)}
					<div class="flex flex-wrap gap-1 rounded-lg bg-contrast/80 p-2">
						<Listbox
							size="sm"
							placeholder="Переменная"
							class="flex-1"
							readonly={$readonlyStore}
							on:change={({ detail }) => handleSelectVariable(key, detail)}
							bind:value={operation.variable}
							list={$variablesStore.map(({ name }) => name)}
						/>
						<Listbox
							list={symbols[active]}
							placeholder=""
							on:change={handleChange}
							readonly={$readonlyStore}
							bind:value={operation.symbol}
							align="center"
							let:value
							let:click
						>
							<Button
								size="sm"
								disabled={variable?.expect !== 'Число'}
								on:click={click}
								variant="ghost"
								class="bg-contrast-9 text-text"
							>
								{value}
							</Button>
						</Listbox>
						{#if variable?.expect !== 'Да/Нет'}
							<Input
								size="sm"
								class="flex-1"
								bind:value={operation.value}
								placeholder="Значение"
								maxlength={32}
								readonly={$readonlyStore}
								on:input={handleChange}
								number={variable?.expect === 'Число'}
							/>
						{:else}
							<Listbox
								bind:value={operation.value}
								class="flex-1"
								placeholder="Значение"
								size="sm"
								readonly={$readonlyStore}
								align="inset"
								list={[{ title: 'Да' }, { title: 'Нет' }]}
								on:change={handleChange}
							/>
						{/if}
					</div>
				{/if}
			{/each}
		</FormSplit>
		{#if !editMode && !$readonlyStore}
			<Button
				variant="ghost"
				class="bg-contrast-9 w-full justify-center text-text"
				on:click={handleAddModificator}
			>
				{active === 'logic' ? 'Добавить условие' : 'Добавить переменную'}
			</Button>
		{/if}
	</div>
</div>
