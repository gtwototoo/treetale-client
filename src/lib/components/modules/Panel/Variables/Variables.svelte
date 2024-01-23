<script lang="ts">
	import { Cloud, Variable } from 'svelte-heros-v2';

	import Note from '../Note.svelte';

	import VariableRow from './Variable.svelte';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { updateVars } from '$lib/requests/story';
	import { informationDataStore, readonlyStore, variablesStore } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';
	import { correctWhitespace } from '$lib/utils';
	import Panel from '../Panel.svelte';

	let timer: number;
	let saving = false;
	let saveInfo = 'Ожидание изменений';

	const addVariable = () => {
		$variablesStore = [
			...$variablesStore,
			{
				name: '',
				expect: 'Строка',
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

	$: editMode = $currentPanelStore.editMode;
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
			<VariableRow varKey={key} {checkUpdates} />
		{/each}
		{#if !editMode && !$readonlyStore}
			<Button
				variant="ghost"
				on:click={addVariable}
				class="bg-contrast-9 justify-center text-text"
			>
				Добавить переменную
			</Button>
		{/if}
	</div>
	{#if !$readonlyStore}
		<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
			{#if saving}
				<Icon type={Cloud} class="h-4 animate-pulse text-gray-600" />
			{:else}
				{saveInfo}
			{/if}
		</div>
	{/if}
</Panel>
