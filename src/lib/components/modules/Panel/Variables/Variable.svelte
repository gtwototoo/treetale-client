<script lang="ts">
	import clsx from 'clsx';
	import { XMark } from 'svelte-heros-v2';

	import { Button, FormSplit, Input, Listbox } from '$UI';
	import type { IList } from '$UI/Listbox.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore, variablesStore } from '$lib/stores/editing';
	import { currentPanelStore, redColorStore } from '$lib/stores/main';
	import type { TVariableExpects } from '$lib/types';

	export let varKey: number;
	export let checkUpdates: () => void;

	type TExpects = IList & {
		title: TVariableExpects;
	};

	const types: Array<TExpects> = [
		{ title: 'Строка' },
		{ title: 'Число' },
		{
			title: 'Да/Нет',
			click: () => {
				if (!['Да', 'Нет'].includes($variablesStore[varKey].value))
					$variablesStore[varKey].value = 'Да';
			}
		}
	];

	const removeVariable = () => {
		$variablesStore.splice(varKey, 1);

		$variablesStore = [...$variablesStore];

		checkUpdates();
	};

	const handleInput = () => {
		checkUpdates();
	};

	$: editMode = $currentPanelStore.editMode;
</script>

<FormSplit class="w-full divide-contrast">
	<Input
		bind:value={$variablesStore[varKey].name}
		placeholder="Название"
		readonly={$readonlyStore}
		class={clsx('shrink-0', editMode ? 'grow' : 'w-[13rem]')}
		disabled={editMode}
		on:input={handleInput}
	>
		<Listbox
			size="sm"
			bind:value={$variablesStore[varKey].expect}
			placeholder="Тип"
			list={types}
			align="right"
			readonly={$readonlyStore}
			class="-mr-2 ml-2"
			on:change={handleInput}
		/>
	</Input>
	{#if !editMode}
		{#if $variablesStore[varKey].expect === 'Да/Нет'}
			<Listbox
				bind:value={$variablesStore[varKey].value}
				placeholder="Значение"
				readonly={$readonlyStore}
				align="inset"
				class="w-full child-[button]:!rounded-none child-[button]:!rounded-r-lg"
				list={[{ title: 'Да' }, { title: 'Нет' }]}
				on:change={handleInput}
			/>
		{:else}
			<Input
				bind:value={$variablesStore[varKey].value}
				placeholder="Значение"
				class="w-full"
				readonly={$readonlyStore}
				number={$variablesStore[varKey].expect !== 'Строка'}
				on:input={handleInput}
			/>
		{/if}
	{/if}
	{#if editMode}
		<Button
			variant="main"
			on:click={removeVariable}
			class={clsx('!text-red-500', $redColorStore)}
		>
			<Icon type={XMark} />
		</Button>
	{/if}
</FormSplit>
