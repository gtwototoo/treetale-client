<script lang="ts">
	import clsx from 'clsx';
	import { PencilSquare, XMark } from 'svelte-heros-v2';

	import { Button, FormSplit, Input, Listbox } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore, variablesStore } from '$lib/stores/editing';
	import { redColorStore } from '$lib/stores/main';
	import { framesDataStore } from '$lib/stores/workspace';
	import type {
		ILogicOperation,
		IMathOperation,
		TComparisonOperator,
		TMathOperator
	} from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let className = '';
	export { className as class };

	export let title: string;
	export let buttonTitle: string;
	export let operations: Array<IMathOperation | ILogicOperation>;
	export let symbols: Array<TComparisonOperator | TMathOperator>;

	let editMode = false;

	const switchEditMode = () => {
		editMode = !editMode;
	};

	const clearLiberties = (readonly: boolean) => {
		if (!readonly) return;

		editMode = false;
	};

	const handleChange = () => {
		$framesDataStore = $framesDataStore;
	};

	const handleAddModificator = () => {
		dispatch('add');
	};

	const handleRemoveModificator = (key: number) => {
		dispatch('remove', key);
	};

	$: clearLiberties($readonlyStore);
</script>

<div
	class={clsx(
		'relative flex select-none flex-col items-center gap-2 rounded-lg bg-main-40 p-2 text-sm',
		className
	)}
>
	<div class="relative flex w-full items-center justify-center">
		<p class="text-sm/10">{title}</p>
		{#if !$readonlyStore}
			<Button
				size="sm"
				variant={editMode ? 'main' : 'ghost'}
				class={clsx('!absolute right-0 z-[2] bg-main !px-1 text-text')}
				on:click={switchEditMode}
			>
				<Icon type={PencilSquare} class="h-4 w-4" />
			</Button>
		{/if}
	</div>
	<div class="flex w-full flex-col gap-2">
		{#each operations as operation, key}
			<FormSplit class="divide-main-40">
				{#if editMode}
					<Button variant="main" disabled class="w-full gap-3 bg-main">
						<p>{operation.variable || 'Переменная'}</p>
						<p>{operation.symbol}</p>
						<p>{operation.value || 'Значение'}</p>
					</Button>
					<Button
						variant="main"
						on:click={() => handleRemoveModificator(key)}
						class={clsx('!text-red-500', $redColorStore)}
					>
						<Icon type={XMark} />
					</Button>
				{:else}
					<Listbox
						placeholder="Переменная"
						readonly={$readonlyStore}
						on:change={handleChange}
						bind:value={operation.variable}
						list={$variablesStore.map(({ name }) => name)}
						class="flex-1 child-[button]:!rounded-none child-[button]:!rounded-l-lg"
					/>
					<Listbox
						list={symbols}
						placeholder=""
						align="inset"
						on:change={handleChange}
						readonly={$readonlyStore}
						bind:value={operation.symbol}
						let:value
						let:click
					>
						<Button on:click={click} variant="ghost" class="!rounded-none bg-main text-text">
							{value}
						</Button>
					</Listbox>
					<Input
						placeholder="Значение"
						readonly={$readonlyStore}
						class="flex-1"
						on:input={handleChange}
						bind:value={operation.value}
					/>
				{/if}
			</FormSplit>
		{/each}
		<slot {editMode} />
		{#if !editMode && !$readonlyStore}
			<Button
				variant="ghost"
				class="w-full justify-center bg-main text-text"
				on:click={handleAddModificator}
			>
				{buttonTitle}
			</Button>
		{/if}
	</div>
</div>
