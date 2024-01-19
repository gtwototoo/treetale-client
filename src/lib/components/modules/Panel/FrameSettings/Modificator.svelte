<script lang="ts">
	import clsx from 'clsx';
	import { PencilSquare, XMark } from 'svelte-heros-v2';

	import { Button, Input, Listbox } from '$UI';
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

	const handleSelectVariable = (key: number, variableName: string) => {
		const variable = $variablesStore.find(({ name }) => name === variableName);

		if (variable.expect === 'Да/Нет') {
			if (!['Да', 'Нет'].includes(operations[key].value)) {
				operations[key].value = 'Да';
			}
		}

		if (variable.expect !== 'Число') {
			operations[key].symbol = '=';
		}

		handleChange();
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
			{#if editMode}
				{@const value = `${operation.variable || 'Переменная'} ${operation.symbol} ${
					operation.value || 'Значение'
				}`}
				<Input placeholder="Значение" readonly {value}>
					<svelte:fragment slot="right">
						<Button
							variant="main"
							size="sm"
							on:click={() => handleRemoveModificator(key)}
							class={clsx('!px-1 !text-red-500', $redColorStore)}
						>
							<Icon type={XMark} class="h-4 w-4" />
						</Button>
					</svelte:fragment>
				</Input>
			{:else}
				{@const variable = $variablesStore.find(({ name }) => name === operation.variable)}
				<div class="flex flex-wrap gap-1 rounded-lg bg-main-10 p-2">
					<Listbox
						size="sm"
						placeholder="Переменная"
						class="flex-1"
						readonly={$readonlyStore}
						on:change={({ detail }) => handleSelectVariable(key, detail)}
						bind:value={operation.variable}
						list={$variablesStore.map(({ name }) => name)}
					/>
					<Listbox
						list={symbols}
						placeholder=""
						on:change={handleChange}
						readonly={$readonlyStore}
						bind:value={operation.symbol}
						let:value
						let:click
					>
						<Button
							size="sm"
							disabled={variable?.expect !== 'Число'}
							on:click={click}
							variant="ghost"
							class="bg-main text-text"
						>
							{value}
						</Button>
					</Listbox>
					{#if variable?.expect !== 'Да/Нет'}
						<Input
							size="sm"
							class="flex-1"
							bind:value={operation.value}
							placeholder="Значение"
							readonly={$readonlyStore}
							on:input={handleChange}
							number={variable?.expect === 'Число'}
						/>
					{:else}
						<Listbox
							bind:value={operation.value}
							class="flex-1"
							placeholder="Значение"
							size="sm"
							readonly={$readonlyStore}
							align="inset"
							list={[{ title: 'Да' }, { title: 'Нет' }]}
							on:change={handleChange}
						/>
					{/if}
				</div>
			{/if}
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
