<script lang="ts">
	import { updateVars } from '$board/requests/story';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { storyInfoStore } from '$board/stores/info.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import { Cloud, Variable } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { correctWhitespace } from '$lib/utils/text';

	import ShortDescription from './ShortDescription.svelte';
	import VariableRow from './Variables/Variable.svelte';

	let timer = $state<number>();
	let saving = $state(false);
	let saveInfo = $state('Ожидание изменений');

	const addVariable = () => {
		variablesStore.variables.push({
			expect: 'Строка',
			name: '',
			value: ''
		});

		checkUpdates();
	};

	const checkUpdates = () => {
		clearTimeout(timer);

		saving = true;

		timer = window.setTimeout(async () => {
			if (storyInfoStore.info) {
				try {
					await updateVars(storyInfoStore.info.storyId, variablesStore.variables);

					saveInfo = 'Изменения сохранены';
				} catch {
					saveInfo = 'Ошибка сохранения';
				}
			}

			clearTimeout(timer);
			saving = false;
		}, 3000);
	};
</script>

<ShortDescription icon={Variable}>
	<div>
		<span class="text-violet-500">Переменные</span>
		{correctWhitespace(
			' - это данные, которые можно использовать в любом месте любого текста, будь то описание, либо вариант выбора и так далее, а так же этими переменными можно как угодно манипулировать в процессе истории.'
		)}
	</div>
</ShortDescription>
<div class="flex flex-col gap-2">
	{#each variablesStore.variables as variable}
		<VariableRow {checkUpdates} {variable} />
	{/each}
	{#if !panelStatesStore.editMode && !readonlyModeStore.isEnabled}
		<Button class="justify-center bg-contrast-9 text-text" onclick={addVariable}>
			Добавить переменную
		</Button>
	{/if}
</div>
{#if !readonlyModeStore.isEnabled}
	<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
		{#if saving}
			<Icon class="h-4 animate-pulse text-gray-600" this={Cloud} />
		{:else}
			{saveInfo}
		{/if}
	</div>
{/if}
