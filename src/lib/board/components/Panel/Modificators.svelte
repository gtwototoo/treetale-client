<script lang="ts">
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { boardEventsStore, readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import last from 'lodash/last';
	import { Beaker } from 'svelte-heros-v2';
	import { Button, Listbox } from 'treetale-ui';

	import type { PanelProps } from '$lib/types';

	import Logics from '$lib/components/Icons/Logics.svelte';
	import Maths from '$lib/components/Icons/Maths.svelte';
	import { clm } from '$lib/utils/classMerge';
	import { correctWhitespace } from '$lib/utils/text';
	import { choiceModificators } from '$lib/utils/variableOperations';

	import Modificator from './Modificators/Modificator.svelte';
	import ShortDescription from './ShortDescription.svelte';

	const handleAddModificator = (type: 'logic' | 'math') => {
		const lastModificatorId = last(frame.modificators)?.modificatorId || 0;

		frame.modificators.push({
			choiceId,
			modificatorId: lastModificatorId + 1,
			symbol: '=',
			type,
			value: '',
			variable: ''
		});

		boardEventsStore.save();
	};

	const handleRemoveModificator = (modificatorId: number) => {
		let modificatorIndex = findIndex(frame.modificators, { modificatorId });

		frame.modificators.splice(modificatorIndex, 1);
	};

	let { choiceId, frameId } = $derived(
		panelStatesStore.props as { choiceId: number; frameId: number } & PanelProps
	);
	let frame = $derived(find(boardFramesStore.frames, { frameId })!);
	let choice = $derived(find(frame.choices, { choiceId }))!;
	let logicModificators = $derived(choiceModificators(frame, choiceId, 'logic'));
	let mathModificators = $derived(choiceModificators(frame, choiceId, 'math'));
</script>

<ShortDescription icon={Beaker}>
	<div>
		<span class="text-blue-500">Модификаторы</span>
		{correctWhitespace(
			' – инструмент взаимодействия с вариантом выбора, например: добавление условий появления, изменение переменных после выбора варианта, смена типа взаимодействия с вариантом выбора.'
		)}
	</div>
</ShortDescription>
<Button
	class="group justify-between bg-contrast-2"
	disabled={readonlyModeStore.isEnabled}
	onclick={() => (choice.asInput = !choice.asInput)}
>
	Поле ввода
	<div
		class={clm(
			'w-9 rounded-full p-0.5 ',
			choice.asInput
				? 'bg-main group-hover:bg-main-70'
				: 'bg-contrast-9 group-hover:bg-contrast-7'
		)}
	>
		<div
			class={clm(
				'size-4 rounded-inherit bg-contrast transition-transform',
				choice.asInput && 'translate-x-full'
			)}
		></div>
	</div>
</Button>
{#if choice.asInput}
	<Listbox
		placeholder="Переменная для значения поля"
		list={variablesStore.variables.map(({ name }) => name)}
		readonly={readonlyModeStore.isEnabled}
		align="inset"
	/>
{:else}
	{#if logicModificators.length || mathModificators.length}
		<div class="flex w-full flex-col gap-1">
			{#if logicModificators.length}
				<div
					class="flex items-center justify-between border-b border-contrast-5 px-4 py-2 text-sm"
				>
					Условия появления
					<Logics class="h-4 w-auto text-orange-500/50" />
				</div>
				{#each logicModificators as modificator (modificator.modificatorId)}
					<Modificator
						{modificator}
						onremove={() => handleRemoveModificator(modificator.modificatorId)}
					/>
				{/each}
			{/if}
			{#if mathModificators.length}
				<div
					class="flex items-center justify-between border-b border-contrast-5 px-4 py-2 text-sm"
				>
					Изменение переменных
					<Maths class="h-4 w-auto text-blue-500/50" />
				</div>
				{#each mathModificators as modificator (modificator.modificatorId)}
					<Modificator
						{modificator}
						onremove={() => handleRemoveModificator(modificator.modificatorId)}
					/>
				{/each}
			{/if}
		</div>
	{:else}
		<p class="p-2 text-center text-sm text-gray-500">Нет модификаторов</p>
	{/if}
	{#if !panelStatesStore.editMode && !readonlyModeStore.isEnabled}
		<div class="flex gap-2 *:flex-1">
			<Button
				class="justify-center bg-contrast-9 text-text hover:bg-contrast-7"
				onclick={() => handleAddModificator('logic')}
			>
				Условие
			</Button>
			<Button
				class="justify-center bg-contrast-9 text-text hover:bg-contrast-7"
				onclick={() => handleAddModificator('math')}
			>
				Операция
			</Button>
		</div>
	{/if}
{/if}
