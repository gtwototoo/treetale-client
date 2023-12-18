<script lang="ts">
	import Modificator from './Modificator.svelte';

	import { framesDataStore } from '$lib/stores/workspace';
	import type { TMathOperator } from '$lib/types';

	export let frameKey: number;
	export let choiceKey: number;

	const symbols: Array<TMathOperator> = ['+', '-', '*', '/', '='];

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

	const removeMathOperation = ({ detail }: CustomEvent<number>) => {
		$framesDataStore[frameKey].choices[choiceKey].mathOperations.splice(detail, 1);

		$framesDataStore[frameKey].choices[choiceKey].mathOperations = [
			...$framesDataStore[frameKey].choices[choiceKey].mathOperations
		];
	};
</script>

<Modificator
	class="text-violet-500"
	title="Изменения переменных"
	buttonTitle="Добавить переменную"
	operations={$framesDataStore[frameKey].choices[choiceKey].mathOperations}
	on:add={addMathOperation}
	on:remove={removeMathOperation}
	{symbols}
/>
