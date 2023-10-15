<script lang="ts">
	import { Button, FormSplit, Input, Listbox } from '$UI';
	import { variablesStore } from '$lib/stores/newediting';
	import { framesDataStore } from '$lib/stores/workspace';
	import type { TMathOperator } from '$lib/types';

	import Modificator from './Modificator.svelte';

	export let frameKey: number;
	export let choiceKey: number;

	const symbols: TMathOperator[] = ['+', '-', '*', '/'];

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
</script>

<Modificator class="bg-violet-100" title="Изменения переменных">
	<div class="flex flex-col gap-2 w-full">
		{#each $framesDataStore[frameKey].choices[choiceKey].mathOperations as operation}
			<FormSplit>
				<Listbox
					placeholder="Переменная"
					bind:value={operation.variable}
					list={$variablesStore.map(({ name }) => name)}
					class="flex-1 child-[button]:!rounded-none child-[button]:!rounded-l-lg"
				/>
				<Listbox list={symbols} placeholder="" value={operation.symbol} let:value let:click>
					<Button on:click={click} class="!rounded-none">{value}</Button>
				</Listbox>
				<Input placeholder="Значение" class="flex-1" bind:value={operation.value} />
			</FormSplit>
		{/each}
		<Button class="justify-center w-full" on:click={addMathOperation}>Добавить изменение</Button>
	</div>
</Modificator>
