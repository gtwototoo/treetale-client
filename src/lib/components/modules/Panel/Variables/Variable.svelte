<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { IVariable } from '$lib/types';
	import { Button, Input, Listbox } from '$UI';
	import type { IList } from '$UI/Listbox.svelte';
	import { createEventDispatcher } from 'svelte';
	import { Trash } from 'svelte-heros-v2';

	export let data: IVariable;

	const dispatch = createEventDispatcher();

	const types: IList[] = [
		{ text: 'Строка' },
		{ text: 'Число' },
		{
			text: 'Да/Нет',
			click: () => {
				if (!['Да', 'Нет'].includes(data.value)) data.value = 'Да';
			}
		}
	];

	const handleInput = (e: InputEvent | Event) => {
		dispatch('input', e);
	};
</script>

<div class="flex items-center gap-2">
	<Input bind:value={data.name} placeholder="Название" class="w-full" on:input={handleInput} />
	<Listbox
		bind:value={data.expect}
		placeholder="Тип"
		class="w-24 shrink-0"
		list={types}
		on:input={handleInput}
	/>
	<p>=</p>
	{#if data.expect === 'Да/Нет'}
		<Listbox
			bind:value={data.value}
			placeholder="Значение"
			class="w-full"
			list={[{ text: 'Да' }, { text: 'Нет' }]}
			on:input={handleInput}
		/>
	{:else}
		<Input
			bind:value={data.value}
			placeholder="Значение"
			class="w-full"
			number={data.expect !== 'Строка'}
			on:input={handleInput}
		/>
	{/if}
	<Button on:click size="sm">
		<Icon type={Trash} class="text-red-600" />
	</Button>
</div>
