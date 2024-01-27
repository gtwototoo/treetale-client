<script lang="ts">
	import { Cloud, Variable } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { updateVars } from '$lib/requests/story';
	import { informationDataStore, readonlyStore, variablesStore } from '$lib/stores/editing';
	import { panelEditMode } from '$lib/stores/panel';
	import { correctWhitespace } from '$lib/utils';
	import { Button } from '$UI';

	import Note from '../Note.svelte';
	import Panel from '../Panel.svelte';
	import VariableRow from './Variable.svelte';

	let timer: number;
	let saving = false;
	let saveInfo = 'Ожидание изменений';

	const addVariable = () => {
		$variablesStore = [
			...$variablesStore,
			{
				expect: 'Строка',
				name: '',
				value: ''
			}
		];

		checkUpdates();
	};

	const checkUpdates = () => {
		clearTimeout(timer);
		saving = true;

		timer = window.setTimeout(async () => {
			try {
				await updateVars($informationDataStore.storyId, $variablesStore);

				saveInfo = 'Изменения сохранены';
			} catch {
				saveInfo = 'Ошибка сохранения';
			}

			clearTimeout(timer);
			saving = false;
		}, 3000);
	};
</script>

<Panel title="Переменные">
	<Note icon={Variable}>
		<div>
			<span class="text-violet-500">Переменные</span>
			{correctWhitespace(
				' - это данные, которые можно использовать в любом месте любого текста, будь то описание, либо вариант выбора и так далее, а так же этими переменными можно как угодно манипулировать в процессе истории.'
			)}
		</div>
	</Note>
	<div class="flex flex-col gap-2">
		{#each $variablesStore.keys() as key}
			<VariableRow {checkUpdates} varKey={key} />
		{/each}
		{#if !$panelEditMode && !$readonlyStore}
			<Button
				class="justify-center bg-contrast-9 text-text"
				on:click={addVariable}
				variant="ghost"
			>
				Добавить переменную
			</Button>
		{/if}
	</div>
	{#if !$readonlyStore}
		<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
			{#if saving}
				<Icon class="h-4 animate-pulse text-gray-600" type={Cloud} />
			{:else}
				{saveInfo}
			{/if}
		</div>
	{/if}
</Panel>
