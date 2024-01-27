<script lang="ts">
	import type { IList } from '$UI/Listbox.svelte';

	import clsx from 'clsx';
	import { XMark } from 'svelte-heros-v2';

	import type { TVariableExpects } from '$lib/types';

	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore, variablesStore } from '$lib/stores/editing';
	import { redColorStore } from '$lib/stores/main';
	import { panelEditMode } from '$lib/stores/panel';
	import { Button, FormSplit, Input, Listbox } from '$UI';

	export let varKey: number;
	export let checkUpdates: () => void;

	type TExpects = IList & {
		title: TVariableExpects;
	};

	const types: Array<TExpects> = [
		{ title: 'Строка' },
		{ title: 'Число' },
		{
			click: () => {
				if (!['Да', 'Нет'].includes($variablesStore[varKey].value))
					$variablesStore[varKey].value = 'Да';
			},
			title: 'Да/Нет'
		}
	];

	const removeVariable = () => {
		$variablesStore.splice(varKey, 1);

		$variablesStore = [...$variablesStore];

		checkUpdates();
	};
</script>

<FormSplit class="w-full">
	<Input
		bind:value={$variablesStore[varKey].name}
		class={clsx('shrink-0', $panelEditMode ? 'grow' : 'w-[13rem]')}
		disabled={$panelEditMode}
		maxlength={15}
		on:input={checkUpdates}
		placeholder="Название"
		readonly={$readonlyStore}
	>
		<svelte:fragment slot="right">
			<Listbox
				align="right"
				bind:value={$variablesStore[varKey].expect}
				list={types}
				on:change={checkUpdates}
				placeholder="Тип"
				readonly={$readonlyStore}
				size="sm"
			/>
		</svelte:fragment>
	</Input>
	{#if !$panelEditMode}
		{#if $variablesStore[varKey].expect === 'Да/Нет'}
			<Listbox
				align="inset"
				bind:value={$variablesStore[varKey].value}
				class="w-full child-[button]:!rounded-none child-[button]:!rounded-r-lg"
				list={[{ title: 'Да' }, { title: 'Нет' }]}
				on:change={checkUpdates}
				placeholder="Значение"
				readonly={$readonlyStore}
			/>
		{:else}
			<Input
				bind:value={$variablesStore[varKey].value}
				class="w-full"
				maxlength={32}
				number={$variablesStore[varKey].expect !== 'Строка'}
				on:input={checkUpdates}
				placeholder="Значение"
				readonly={$readonlyStore}
			/>
		{/if}
	{/if}
	{#if $panelEditMode}
		<Button
			class={clsx('!text-red-500', $redColorStore)}
			on:click={removeVariable}
			variant="main"
		>
			<Icon type={XMark} />
		</Button>
	{/if}
</FormSplit>
