<script lang="ts">
	import find from 'lodash/find';
	import findIndex from 'lodash/findIndex';
	import last from 'lodash/last';
	import { Beaker } from 'svelte-heros-v2';
	import { Input } from 'treetale-ui';

	import Logics from '$lib/components/Icons/Logics.svelte';
	import Maths from '$lib/components/Icons/Maths.svelte';
	import type { PanelProps } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';
	import { correctWhitespace } from '$lib/utils/text';
	import { choiceModificators } from '$lib/utils/variableOperations';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { boardEventsStore, readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import ShortDescription from '../ShortDescription.svelte';

	import Modificator from './Modificator.svelte';

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
	let logicModificators = $derived(choiceModificators(frame.modificators, choiceId, 'logic'));
	let mathModificators = $derived(choiceModificators(frame.modificators, choiceId, 'math'));
</script>

<ShortDescription icon={Beaker}>
	<div>
		<span class="text-blue-500">Модификаторы</span>
		{correctWhitespace(
			' – инструмент взаимодействия с вариантом выбора, например: добавление условий появления, изменение переменных после выбора варианта, смена типа взаимодействия с вариантом выбора.'
		)}
	</div>
</ShortDescription>
<div class="bg-contrast-200 flex flex-col rounded-lg px-2 text-sm">
	<Button
		class="group justify-between py-3 pr-0 pl-1"
		disabled={readonlyModeStore.isEnabled}
		onclick={() => (choice.asInput = !choice.asInput)}
	>
		Поле ввода
		<div
			class={clm(
				'w-9 rounded-full p-0.5',
				choice.asInput
					? 'bg-main-700 group-hover:bg-main'
					: 'bg-contrast-900 group-hover:bg-contrast-700'
			)}
		>
			<div
				class={clm(
					'rounded-inherit bg-contrast size-4 transition-transform',
					choice.asInput && 'translate-x-full'
				)}
			></div>
		</div>
	</Button>
	{#if choice.asInput}
		<p class="border-contrast-600 border-t py-2 pl-2 text-left text-xs">
			Чтобы применить введеное в поле значение, нужно задать значение
			<span class="font-medium text-violet-500">
				{`{input}`}
			</span> в любое поле изменения переменной с типом «Строка»
		</p>
	{/if}
</div>
{#if choice.asInput}
	<Input
		placeholder="Надпись внутри поля ввода"
		bind:value={choice.inputText}
		oninput={boardEventsStore.save}
	/>
{/if}
{#if logicModificators.length || mathModificators.length}
	<div class="flex w-full flex-col gap-1">
		{#if logicModificators.length}
			<div class="flex items-center justify-between px-3 py-2 text-sm">
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
			<div class="flex items-center justify-between px-3 py-2 text-sm">
				Изменение переменных
				<Maths class="h-4 w-auto text-blue-500/50" />
			</div>
			{#each mathModificators as modificator (modificator.modificatorId)}
				<Modificator
					asInput={choice.asInput}
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
			class={clm(button.type.primary, button.size.base, 'justify-center')}
			onclick={() => handleAddModificator('logic')}
		>
			Условие
		</Button>
		<Button
			class={clm(button.type.primary, button.size.base, 'justify-center')}
			onclick={() => handleAddModificator('math')}
		>
			Операция
		</Button>
	</div>
{/if}
