<script lang="ts">
	import { XMark } from 'svelte-heros-v2';

	import Modificator from './Modificator.svelte';

	import Icon from '$lib/components/Icon.svelte';
	import { variablesStore } from '$lib/stores/newediting';
	import { framesDataStore } from '$lib/stores/workspace';
	import type { TMathOperator } from '$lib/types';
	import { Button, FormSplit, Input, Listbox } from '$UI';

	export let frameKey: number;
	export let choiceKey: number;

	const symbols: Array<TMathOperator> = ['+', '-', '*', '/'];

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

	const removeMathOperation = (key: number) => {
		$framesDataStore[frameKey].choices[choiceKey].mathOperations.splice(key, 1);

		$framesDataStore[frameKey].choices[choiceKey].mathOperations = [
			...$framesDataStore[frameKey].choices[choiceKey].mathOperations
		];
	};
</script>

<Modificator class="bg-violet-100" title="Изменения переменных" let:editMode>
	<div class="flex flex-col gap-2 w-full">
		{#each $framesDataStore[frameKey].choices[choiceKey].mathOperations as operation, key}
			<FormSplit>
				{#if editMode}
					<Button disabled class="w-full gap-3">
						<p>{operation.variable || 'Переменная'}</p>
						<p>{operation.symbol}</p>
						<p>{operation.value || 'Значение'}</p>
					</Button>
					<Button
						variant="main"
						on:click={() => removeMathOperation(key)}
						class="!text-red-500 !bg-red-100"
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
						<Button on:click={click} class="!rounded-none">{value}</Button>
					</Listbox>
					<Input placeholder="Значение" class="flex-1" bind:value={operation.value} />
				{/if}
			</FormSplit>
		{/each}
		{#if !editMode}
			<Button class="justify-center w-full" on:click={addMathOperation}>
				Добавить изменение
			</Button>
		{/if}
	</div>
</Modificator>
