<script lang="ts">
	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { updateVars } from '$lib/requests/story';
	import { storyInfo, vars } from '$lib/stores/editing';
	import { correctWhitespace } from '$lib/utils';
	import { Cloud, Variable } from 'svelte-heros-v2';
	import Note from '../Note.svelte';
	import VariableRow from './Variable.svelte';

	let timer: number;
	let saveInfo = 'Ожидание изменений';

	const addVariable = () => {
		$vars = [
			...$vars,
			{
				name: '',
				expect: 'Строка',
				value: ''
			}
		];

		checkUpdates();
	};

	const removeVariable = (key: number) => {
		$vars.splice(key, 1);

		$vars = [...$vars];

		checkUpdates();
	};

	const checkUpdates = () => {
		clearTimeout(timer);

		timer = window.setTimeout(async () => {
			try {
				await updateVars($storyInfo.storyId, $vars);

				saveInfo = 'Изменения сохранены';
			} catch {
				saveInfo = 'Ошибка сохранения';
			}

			clearTimeout(timer);
		}, 3000);
	};
</script>

<div class="flex flex-col items-stretch gap-4 p-3">
	<Note icon={Variable}>
		<div>
			<span class="text-violet-500">Переменные</span>
			{correctWhitespace(
				' - это данные, которые можно использовать в любом месте любого текста, будь то описание, либо вариант выбора и так далее, а так же этими переменными можно как угодно манипулировать в процессе истории.'
			)}
		</div>
	</Note>
	<div class="flex flex-col gap-2">
		{#each $vars as data, key}
			<VariableRow {data} on:click={() => removeVariable(key)} on:input={checkUpdates} />
		{/each}
		<Button on:click={addVariable} class="justify-center">Добавить переменную</Button>
	</div>
	<div class="pointer-events-none flex select-none justify-center text-xs text-gray-500">
		{#if timer}
			<Icon type={Cloud} class="h-4 animate-pulse text-gray-600" />
		{:else}
			{saveInfo}
		{/if}
	</div>
</div>
