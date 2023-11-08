<script lang="ts">
	import { XMark } from 'svelte-heros-v2';

	import Modificator from './Modificator.svelte';

	import { Button, FormSplit, Input, Listbox } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { redColorStore } from '$lib/stores/main';
	import { variablesStore } from '$lib/stores/newediting';
	import { framesDataStore } from '$lib/stores/workspace';
	import type { TComparisonOperator } from '$lib/types';
	import clsx from 'clsx';

	export let frameKey: number;
	export let choiceKey: number;

	const symbols: Array<TComparisonOperator> = ['=', '≥', '≤', '>', '<', '≠'];

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

	const removeLogicOperation = (key: number) => {
		$framesDataStore[frameKey].choices[choiceKey].logicOperations.splice(key, 1);

		$framesDataStore[frameKey].choices[choiceKey].logicOperations = [
			...$framesDataStore[frameKey].choices[choiceKey].logicOperations
		];
	};
</script>

<Modificator class="bg-main-40 text-orange-500" title="Условия появления" let:editMode>
	<div class="flex flex-col gap-2 w-full">
		{#each $framesDataStore[frameKey].choices[choiceKey].logicOperations as operation, key}
			<FormSplit class="divide-main-40">
				{#if editMode}
					<Button variant="main" disabled class="w-full gap-3 bg-main">
						<p>{operation.variable || 'Переменная'}</p>
						<p>{operation.symbol}</p>
						<p>{operation.value || 'Значение'}</p>
					</Button>
					<Button
						variant="main"
						on:click={() => removeLogicOperation(key)}
						class={clsx('!text-red-500', $redColorStore)}
					>
						<Icon type={XMark} />
					</Button>
				{:else}
					<Listbox
						placeholder="Переменная"
						bind:value={operation.variable}
						list={$variablesStore.map(({ name }) => name)}
						class="flex-1 child-[button]:!rounded-none child-[button]:!rounded-l-lg"
					/>
					<Listbox
						list={symbols}
						placeholder=""
						bind:value={operation.symbol}
						let:value
						let:click
					>
						<Button on:click={click} variant="ghost" class="bg-main text-text !rounded-none">
							{value}
						</Button>
					</Listbox>
					<Input placeholder="Значение" class="flex-1" bind:value={operation.value} />
				{/if}
			</FormSplit>
		{/each}
		{#if !editMode}
			<Button
				variant="ghost"
				class="justify-center w-full bg-main text-text"
				on:click={addLogicOperation}
			>
				Добавить условие
			</Button>
		{/if}
	</div>
</Modificator>
