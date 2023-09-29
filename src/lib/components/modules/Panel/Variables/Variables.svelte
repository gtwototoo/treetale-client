<script lang="ts">
	import { Button, Selector, SelectorItem } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { updateVars } from '$lib/requests/story';
	import { storyInfo, vars } from '$lib/stores/editing';
	import { correctWhitespace } from '$lib/utils';
	import clsx from 'clsx';
	import { Cloud, Variable } from 'svelte-heros-v2';
	import Note from '../Note.svelte';
	import VariableRow from './Variable.svelte';

	let timer: number;
	let removeMode = false;
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

	const switchMode = () => {
		removeMode = !removeMode;
	};
</script>

<div class="flex flex-col items-stretch gap-4">
	<Note icon={Variable}>
		<div>
			<span class="text-violet-500">Переменные</span>
			{correctWhitespace(
				' - это данные, которые можно использовать в любом месте любого текста, будь то описание, либо вариант выбора и так далее, а так же этими переменными можно как угодно манипулировать в процессе истории.'
			)}
		</div>
	</Note>
	<Selector on:change={checkUpdates} class="mb-4">
		<SelectorItem class="flex-1 justify-center" active={!removeMode} on:click={switchMode}>
			Редактирование
		</SelectorItem>
		<SelectorItem
			class={clsx('flex-1 justify-center', {
				'!text-red-500 !bg-red-300': removeMode
			})}
			active={removeMode}
			on:click={switchMode}
		>
			Удаление
		</SelectorItem>
	</Selector>
	<div class="flex flex-col gap-2">
		{#each $vars as data, key}
			<VariableRow
				{data}
				{removeMode}
				on:click={() => removeVariable(key)}
				on:input={checkUpdates}
			/>
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
