<script lang="ts">
	import { XMark } from 'svelte-heros-v2';

	import Modificator from './Modificator.svelte';

	import { Button, FormSplit, Input, Listbox } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { updateArea } from '$lib/requests/story';
	import {
		informationDataStore,
		readonlyStore,
		stateAreaStore,
		variablesStore
	} from '$lib/stores/editing';
	import { redColorStore } from '$lib/stores/main';
	import { framesDataStore, offsetStore, zoomStore } from '$lib/stores/workspace';
	import type { TComparisonOperator } from '$lib/types';
	import { exclude } from '$lib/utils';
	import clsx from 'clsx';

	export let frameKey: number;
	export let choiceKey: number;

	let timer: number;

	const symbols: Array<TComparisonOperator> = ['=', '≥', '≤', '>', '<', '≠'];

	const saveArea = () => {
		if ($readonlyStore) {
			return;
		}

		clearTimeout(timer);
		$stateAreaStore = 'saving';

		timer = window.setTimeout(async () => {
			try {
				const correctFrames = $framesDataStore.map((frame) => exclude(frame, ['height']));

				await updateArea(
					$informationDataStore.storyId,
					correctFrames,
					$offsetStore,
					$zoomStore
				);

				$stateAreaStore = 'saved';
			} catch {
				$stateAreaStore = 'error';
			}

			clearTimeout(timer);
		}, 3000);
	};

	const handleInput = () => {
		saveArea();
	};

	const addLogicOperation = () => {
		$framesDataStore[frameKey].choices[choiceKey].logicOperations = [
			{
				variable: '',
				symbol: '=',
				value: ''
			},
			...$framesDataStore[frameKey].choices[choiceKey].logicOperations
		];
	};

	const removeLogicOperation = (key: number) => {
		$framesDataStore[frameKey].choices[choiceKey].logicOperations.splice(key, 1);

		$framesDataStore[frameKey].choices[choiceKey].logicOperations = [
			...$framesDataStore[frameKey].choices[choiceKey].logicOperations
		];
	};
</script>

<Modificator class="bg-main-40 text-orange-500" title="Условия появления" let:editMode>
	<div class="flex w-full flex-col gap-2">
		{#each $framesDataStore[frameKey].choices[choiceKey].logicOperations as operation, key}
			<FormSplit class="divide-main-40">
				{#if editMode}
					<Button variant="main" disabled class="w-full gap-3 bg-main">
						<p>{operation.variable || 'Переменная'}</p>
						<p>{operation.symbol}</p>
						<p>{operation.value || 'Значение'}</p>
					</Button>
					<Button
						variant="main"
						on:click={() => removeLogicOperation(key)}
						class={clsx('!text-red-500', $redColorStore)}
					>
						<Icon type={XMark} />
					</Button>
				{:else}
					<Listbox
						placeholder="Переменная"
						bind:value={operation.variable}
						readonly={$readonlyStore}
						list={$variablesStore.map(({ name }) => name)}
						class="flex-1 child-[button]:!rounded-none child-[button]:!rounded-l-lg"
					/>
					<Listbox
						list={symbols}
						placeholder=""
						align="inset"
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
						bind:value={operation.value}
						on:input={handleInput}
					/>
				{/if}
			</FormSplit>
		{/each}
		{#if !editMode && !$readonlyStore}
			<Button
				variant="ghost"
				class="w-full justify-center bg-main text-text"
				on:click={addLogicOperation}
			>
				Добавить условие
			</Button>
		{/if}
	</div>
</Modificator>
