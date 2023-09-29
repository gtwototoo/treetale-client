<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { IVariable } from '$lib/types';
	import { Button, FormSplit, Input, Listbox } from '$UI';
	import type { IList } from '$UI/Listbox.svelte';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';
	import { ChevronDown, XMark } from 'svelte-heros-v2';

	export let data: IVariable;
	export let removeMode: boolean;

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
	<FormSplit class="w-full">
		<Input
			bind:value={data.name}
			placeholder="Название"
			class={clsx('shrink-0', removeMode ? 'w-full' : 'w-[13rem]')}
			disabled={removeMode}
			on:input={handleInput}
		>
			<Listbox
				size="sm"
				bind:value={data.expect}
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
		{#if !removeMode}
			{#if data.expect === 'Да/Нет'}
				<Listbox
					bind:value={data.value}
					placeholder="Значение"
					class="w-full child-[button]:!rounded-none child-[button]:!rounded-r-lg"
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
		{/if}
	</FormSplit>
	{#if removeMode}
		<Button on:click class="!text-red-500 !bg-red-50">
			<Icon type={XMark} />
		</Button>
	{/if}
</div>
