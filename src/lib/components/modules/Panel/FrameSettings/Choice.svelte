<script lang="ts">
	import { Button, FormSplit } from '$UI';
	import Contenteditable from '$UI/Contenteditable.svelte';
	import Input from '$UI/Input.svelte';
	import Listbox from '$UI/Listbox.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { variablesStore } from '$lib/stores/newediting';
	import { framesDataStore } from '$lib/stores/workspace';
	import type { TComparisonOperator, TMathOperator } from '$lib/types';
	import clsx from 'clsx';
	import { PencilSquare, Variable } from 'svelte-heros-v2';

	export let choiceId: number;
	export let frameKey: number;

	$: choiceKey = $framesDataStore[frameKey].choices.findIndex(
		(choice) => choice.choiceId === choiceId
	);

	let active: 'logic' | 'math';

	const logicSymbols: TComparisonOperator[] = ['=', '≥', '≤', '>', '<', '≠'];
	const mathSymbols: TMathOperator[] = ['+', '-', '*', '/'];

	let logicEditMode = false;
	let mathEditMode = false;

	const setActiveOperation = (type: 'logic' | 'math') => {
		active = type === active ? null : type;
	};

	const addLogicOperation = () => {
		$framesDataStore[frameKey].choices[choiceKey].logicOperations = [
			{
				variable: '',
				symbol: '=',
				value: ''
			},
			...$framesDataStore[frameKey].choices[choiceKey].logicOperations
		];
	};

	const addMathOperation = () => {
		$framesDataStore[frameKey].choices[choiceKey].mathOperations = [
			{
				variable: '',
				symbol: '+',
				value: ''
			},
			...$framesDataStore[frameKey].choices[choiceKey].mathOperations
		];
	};

	// ЗАМЕНИТЬ ТЕКСТАРЕЮ
</script>

<FormSplit vertical>
	<Contenteditable
		placeholder="Вариант выбора"
		bind:html={$framesDataStore[frameKey].choices[choiceKey].text}
	>
		<svelte:fragment slot="left">
			<Button
				size="sm"
				class={clsx(
					'text-xs gap-1',
					($framesDataStore[frameKey].choices[choiceKey].logicOperations.length ||
						active === 'logic') &&
						'!bg-orange-100'
				)}
				on:click={() => setActiveOperation('logic')}
			>
				<p class="font-bold">if</p>
				{#if $framesDataStore[frameKey].choices[choiceKey].logicOperations.length}
					<p>{$framesDataStore[frameKey].choices[choiceKey].logicOperations.length}</p>
				{/if}
			</Button>
		</svelte:fragment>
		<svelte:fragment slot="right">
			<Button
				size="sm"
				class={clsx(
					'!px-1 gap-1',
					($framesDataStore[frameKey].choices[choiceKey].mathOperations.length ||
						active === 'math') &&
						'!bg-violet-100'
				)}
				on:click={() => setActiveOperation('math')}
			>
				<Icon class="w-4 h-4" type={Variable} />
				{#if $framesDataStore[frameKey].choices[choiceKey].mathOperations.length}
					<p class="pr-1">
						{$framesDataStore[frameKey].choices[choiceKey].mathOperations.length}
					</p>
				{/if}
			</Button>
		</svelte:fragment>
	</Contenteditable>
	{#if active === 'logic'}
		<div class="bg-orange-100 relative p-2 rounded-lg gap-2 text-sm items-center flex flex-col">
			<p class="text-sm/10 select-none">Условия появления</p>
			<Button
				size="sm"
				variant={logicEditMode ? 'main' : 'secondary'}
				class={clsx(
					'!absolute right-2 top-4 z-[2] !px-1',
					logicEditMode && 'bg-main text-text'
				)}
				on:click={() => (logicEditMode = !logicEditMode)}
			>
				<Icon type={PencilSquare} class="w-4 h-4" />
			</Button>
			{#each $framesDataStore[frameKey].choices[choiceKey].logicOperations as operation}
				<FormSplit>
					<Listbox
						placeholder="Переменная"
						bind:value={operation.variable}
						list={$variablesStore.map(({ name }) => name)}
						class="flex-1 child-[button]:!rounded-none child-[button]:!rounded-l-lg"
					/>
					<Listbox
						list={logicSymbols}
						placeholder=""
						value={operation.symbol}
						let:value
						let:click
					>
						<Button on:click={click} class="!rounded-none">{value}</Button>
					</Listbox>
					<Input placeholder="Значение" class="flex-1" bind:value={operation.value} />
				</FormSplit>
			{/each}
			<Button class="justify-center w-full" on:click={addLogicOperation}>
				Добавить условие
			</Button>
		</div>
	{/if}
	{#if active === 'math'}
		<div class="bg-violet-100 p-2 gap-2 text-sm items-center flex flex-col rounded-lg relative">
			<p class="text-sm/10 select-none">Изменения переменных</p>
			<Button
				size="sm"
				variant={mathEditMode ? 'main' : 'secondary'}
				class={clsx('!absolute right-2 top-4 z-[2] !px-1', mathEditMode && 'bg-main text-text')}
				on:click={() => (mathEditMode = !mathEditMode)}
			>
				<Icon type={PencilSquare} class="w-4 h-4" />
			</Button>
			{#each $framesDataStore[frameKey].choices[choiceKey].mathOperations as operation}
				<FormSplit>
					<Listbox
						placeholder="Переменная"
						bind:value={operation.variable}
						list={$variablesStore.map(({ name }) => name)}
						class="flex-1 child-[button]:!rounded-none child-[button]:!rounded-l-lg"
					/>
					<Listbox
						list={mathSymbols}
						placeholder=""
						value={operation.symbol}
						let:value
						let:click
					>
						<Button on:click={click} class="!rounded-none">{value}</Button>
					</Listbox>
					<Input placeholder="Значение" class="flex-1" bind:value={operation.value} />
				</FormSplit>
			{/each}
			<Button class="justify-center w-full" on:click={addMathOperation}>
				Добавить изменение
			</Button>
		</div>
	{/if}
</FormSplit>
