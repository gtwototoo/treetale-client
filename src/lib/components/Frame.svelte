<script lang="ts">
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	import Choice from './Choice.svelte';

	import { FormSplit } from '$UI';
	import ReadCard from '$lib/components/ReadCard.svelte';
	import { framesStore, variablesStore } from '$lib/stores/reading';
	import type { ILogicOperation, TVariableExpects } from '$lib/types';
	import { correctVariableReplace, getFrameFromId } from '$lib/utils';

	const dispatch = createEventDispatcher<{
		click: { choiceId: number };
	}>();

	let className = '';
	export { className as class };

	export let frameId: number;
	export let selectedChoiceId: number;

	const handleClick = (choiceId: number) => {
		dispatch('click', { choiceId });
	};

	const correctSymbol = (symbol: string, logic: boolean) => {
		const replaces: Record<string, string> = {
			'=': '===',
			'≥': '>=',
			'≤': '<=',
			'≠': '!=='
		};

		if (logic) {
			replaces['='] = '===';
		}

		if (!(symbol in replaces)) return symbol;

		return replaces[symbol];
	};

	const correctVariable = (value: string | number, expect: TVariableExpects) => {
		return expect === 'Число' ? value : `"${value}"`;
	};

	const checkLogic = (logicOperations: Array<ILogicOperation>) => {
		return logicOperations
			.map(({ variable, symbol, value }) => {
				const getVariable = $variablesStore.find(({ name }) => name === variable);

				return `${correctVariable(getVariable.value, getVariable.expect)} ${correctSymbol(
					symbol,
					true
				)} ${correctVariable(value, getVariable.expect)}`;
			})
			.every((operation) => eval(operation));
	};

	$: ({ imageUrl, text, choices } = getFrameFromId($framesStore, frameId));
</script>

<ReadCard
	src={imageUrl}
	text={correctVariableReplace(text, $variablesStore) || 'Пустота...'}
	class={clsx('text-left', className)}
	classCard="justify-between !items-start"
>
	{#if choices.length}
		<FormSplit vertical class="w-full divide-main-10">
			{#each choices as { choiceId, text, logicOperations } (choiceId)}
				{#if !logicOperations.length || checkLogic(logicOperations)}
					<Choice
						active={selectedChoiceId === choiceId}
						on:click={() => handleClick(choiceId)}
					>
						{correctVariableReplace(text, $variablesStore) || 'Неожиданный поворот'}
					</Choice>
				{/if}
			{/each}
		</FormSplit>
	{/if}
</ReadCard>
