<script lang="ts">
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { type SelectedChoices, inspectorStore } from '$board/stores/inspector.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import cloneDeep from 'lodash/cloneDeep';
	import filter from 'lodash/filter';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import { Tv } from 'svelte-heros-v2';
	import { Button, FormSplit, Image } from 'treetale-ui';

	import type { Choice, Frame, LogicModificator, MathModificator } from '$lib/types';

	import { currentThemeClass } from '$lib/stores/colors.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { correctVariableReplace } from '$lib/utils/text';
	import { checkLogic, choiceModificators, doMath } from '$lib/utils/variableOperations';

	import ShortDescription from './ShortDescription.svelte';

	let inspectorVariables = $state(cloneDeep(variablesStore.variables));

	const handleClick = (frame: Frame, choice: Choice, index: number) => {
		if (inspectorStore.selectedChoices[index]?.choice.choiceId === choice.choiceId) {
			return;
		}

		inspectorStore.selectedChoices = inspectorStore.selectedChoices.slice(0, index);

		inspectorStore.selectedChoices.push({
			choice,
			frameId: frame.frameId
		});

		inspectorVariables = cloneDeep(variablesStore.variables);

		for (const selectedStage of inspectorStore.selectedChoices) {
			const mathModificators = choiceModificators(
				frame,
				selectedStage.choice.choiceId,
				'math'
			) as MathModificator[];

			if (mathModificators.length) {
				for (const modificator of mathModificators) {
					const variableId = findIndex(inspectorVariables, { name: modificator.variable });
					const firstValue = inspectorVariables[variableId].value;

					inspectorVariables[variableId].value = doMath(
						firstValue,
						modificator.symbol,
						modificator.value
					);
				}
			}
		}
	};

	const clearChoices = () => {
		inspectorStore.selectedChoices = [];
		inspectorVariables = cloneDeep(variablesStore.variables);
	};

	const displayedFramesList = (selectedChoices: SelectedChoices[]) => {
		const firstFrame = boardFramesStore.frames[0];

		if (!firstFrame) {
			return [];
		}

		const displayedFrames = [firstFrame];

		for (const selectedStage of selectedChoices) {
			const addingFrame = find(boardFramesStore.frames, {
				frameId: selectedStage.choice.frameId!
			});

			if (!addingFrame) {
				return [];
			}

			displayedFrames.push(addingFrame);
		}

		return displayedFrames;
	};

	let yellowTextColor = $derived(
		currentThemeClass(clm('text-yellow-200'), clm('text-yellow-500'))
	);

	let frames = $derived(displayedFramesList(inspectorStore.selectedChoices));
</script>

<ShortDescription
	icon={Tv}
	text="Просмотр истории со стороны читателя, а также отладка связей, модификаторов и вариантов выбора"
/>
<div class="flex select-none flex-col gap-4 rounded-lg bg-contrast-2 p-4 text-center text-sm">
	<p>Переменные</p>
	<div class="flex flex-col gap-2">
		{#if inspectorVariables.length}
			{#each inspectorVariables as variable}
				<div class="flex justify-between gap-4">
					<p class="px-2 py-1">{variable.name}</p>
					<div class="rounded-lg bg-main-70 px-2 py-1 text-right">{variable.value}</div>
				</div>
			{/each}
		{:else}
			<p class="text-gray-500">Отсутсвуют</p>
		{/if}
	</div>
</div>
<Button onclick={clearChoices} class="justify-center bg-contrast-9 hover:bg-contrast-7">
	Сбросить все выборы
</Button>
<div class="flex flex-col gap-3 text-sm">
	{#each frames as frame, index (frame.frameId)}
		{@const text = correctVariableReplace(frame.text, inspectorVariables)}
		<div class="relative flex flex-col items-center gap-2 rounded-xl bg-contrast-3 p-2">
			{#if frame.imageUrl}
				<Image
					alt="Изображение блока"
					class="h-48 w-full rounded-lg !bg-main/30 text-text"
					cover
					src={frame.imageUrl}
				/>
			{/if}
			<p class={clm('px-3 py-1', !text && 'text-gray-400')}>
				{@html text || 'Описание блока'}
			</p>
			{#if frame.choices.length}
				<FormSplit vertical class="w-full">
					{#each frame.choices as choice (choice.choiceId)}
						{@const logicModificators = choiceModificators(
							frame,
							choice.choiceId,
							'logic'
						) as LogicModificator[]}
						{@const mathModificators = choiceModificators(
							frame,
							choice.choiceId,
							'math'
						) as MathModificator[]}
						<Button
							class={clm(
								inspectorStore.selectedChoices[index]?.choice.choiceId ===
									choice.choiceId && yellowTextColor,
								'flex-col items-start gap-1 bg-contrast-9 hover:bg-contrast-7'
							)}
							disabled={!choice.frameId ||
								!checkLogic(inspectorVariables, logicModificators)}
							onclick={() => handleClick(frame, choice, index)}
						>
							{#if filter(logicModificators, (modificator) => !!(modificator.variable && modificator.value)).length}
								<p class="text-xs text-orange-500">
									Условие:
									{filter(
										logicModificators,
										(modificator) => !!(modificator.variable && modificator.value)
									)
										.map(
											({ symbol, value, variable }) => `${variable} ${symbol} ${value}`
										)
										.join(' и ')}
								</p>
							{/if}
							<div class="w-full whitespace-normal break-words text-left">
								{@html correctVariableReplace(choice.text, inspectorVariables) ||
									'Вариант выбора'}
							</div>
							{#if mathModificators.length}
								<p class="text-xs text-blue-500">
									Изменения:
									{mathModificators
										.map(
											({ symbol, value, variable }) => `${variable} ${symbol} ${value}`
										)
										.join(' и ')}
								</p>
							{/if}
						</Button>
					{/each}
				</FormSplit>
			{:else}
				<p class="p-2 text-gray-400">Варианты выбора отсутствуют</p>
			{/if}
			{#if index !== frames.length - 1}
				<div class="absolute top-full h-3 w-0.5 bg-yellow-300"></div>
			{/if}
		</div>
	{/each}
</div>
