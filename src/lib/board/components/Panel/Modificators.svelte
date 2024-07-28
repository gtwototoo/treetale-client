<script lang="ts">
	import type { LogicOperation, MathOperation } from '$board/types';

	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { Beaker } from 'svelte-heros-v2';
	import { Button } from 'treetale-ui';

	import { correctWhitespace } from '$lib/utils/text';

	import Modificator from './Modificators/Modificator.svelte';
	import ShortDescription from './ShortDescription.svelte';

	interface Modificator {
		operations: LogicOperation[] | MathOperation[];
		type: 'logic' | 'math';
	}

	const handleAddModificator = () => {
		modificators.push({
			operations: [],
			type: 'logic'
		});
	};

	const handleRemoveModificator = (index: number) => {
		modificators.splice(index, 1);
	};

	let modificators = $state<Modificator[]>([]);
</script>

<ShortDescription icon={Beaker}>
	<div>
		<span class="text-blue-500">Модификаторы</span>
		{correctWhitespace(
			' - это различные операции с переменными, либо условия появления какого-либо варианта ответа.'
		)}
	</div>
</ShortDescription>
<div class="flex flex-col gap-2">
	{#each modificators as modificator, key}
		<Modificator {modificator} onremove={() => handleRemoveModificator(key)} />
	{/each}
	{#if !panelStatesStore.editMode && !readonlyModeStore.isEnabled}
		<Button
			class="justify-center bg-contrast-9 text-text hover:bg-contrast-7"
			onclick={handleAddModificator}
		>
			Добавить модификатор
		</Button>
	{/if}
</div>
