<script lang="ts">
	import Modificator from './Modificator.svelte';

	import { framesDataStore } from '$lib/stores/workspace';
	import type { TComparisonOperator } from '$lib/types';

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

	const removeLogicOperation = ({ detail }: CustomEvent<number>) => {
		$framesDataStore[frameKey].choices[choiceKey].logicOperations.splice(detail, 1);

		$framesDataStore[frameKey].choices[choiceKey].logicOperations = [
			...$framesDataStore[frameKey].choices[choiceKey].logicOperations
		];
	};
</script>

<Modificator
	class="text-orange-500"
	title="Условия появления"
	buttonTitle="Добавить условие"
	operations={$framesDataStore[frameKey].choices[choiceKey].logicOperations}
	on:add={addLogicOperation}
	on:remove={removeLogicOperation}
	{symbols}
/>
