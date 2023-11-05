<script lang="ts">
	import clsx from 'clsx';
	import { ChevronDown, XMark } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { currentPanelStore } from '$lib/stores/main';
	import { variablesStore } from '$lib/stores/newediting';
	import { Button, FormSplit, Input, Listbox } from '$UI';
	import type { IList } from '$UI/Listbox.svelte';

	export let varKey: number;
	export let checkUpdates: () => void;

	const types: Array<IList> = [
		{ text: 'Строка' },
		{ text: 'Число' },
		{
			text: 'Да/Нет',
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
		class={clsx('shrink-0', editMode ? 'grow' : 'w-[13rem]')}
		disabled={editMode}
		on:input={handleInput}
	>
		<Listbox
			size="sm"
			bind:value={$variablesStore[varKey].expect}
			placeholder="Тип"
			list={types}
			class="-mr-2.5 ml-2"
			on:input={handleInput}
			let:value
			let:click
		>
			<Button class="-my-0.5 gap-1" size="sm" on:click={click}>
				{value}
				<Icon type={ChevronDown} class="h-4 w-4" />
			</Button>
		</Listbox>
	</Input>
	{#if !editMode}
		{#if $variablesStore[varKey].expect === 'Да/Нет'}
			<Listbox
				bind:value={$variablesStore[varKey].value}
				placeholder="Значение"
				class="w-full child-[button]:!rounded-none child-[button]:!rounded-r-lg"
				list={[{ text: 'Да' }, { text: 'Нет' }]}
				on:input={handleInput}
			/>
		{:else}
			<Input
				bind:value={$variablesStore[varKey].value}
				placeholder="Значение"
				class="w-full"
				number={$variablesStore[varKey].expect !== 'Строка'}
				on:input={handleInput}
			/>
		{/if}
	{/if}
	{#if editMode}
		<Button variant="main" on:click={removeVariable} class="!text-red-500 !bg-red-100">
			<Icon type={XMark} />
		</Button>
	{/if}
</FormSplit>
