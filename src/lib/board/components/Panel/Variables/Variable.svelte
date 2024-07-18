<script lang="ts">
	import { redBackgroundColorStore } from '$board/stores/colors.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { variablesStore } from '$board/stores/variables.svelte';
	import findIndex from 'lodash/findIndex';
	import { XMark } from 'svelte-heros-v2';
	import { Button, FormSplit, Icon, Input, type ListItemProps, Listbox } from 'treetale-ui';

	import type { Variable, VariableExpects } from '$lib/types';

	import { clm } from '$lib/utils/classMerge';

	let {
		checkUpdates,
		variable
	}: {
		checkUpdates: () => void;
		variable: Variable;
	} = $props();

	type Expects = {
		title: VariableExpects;
	} & ListItemProps;

	const types: Expects[] = [
		{ title: 'Строка' },
		{ title: 'Число' },
		{
			onclick: () => {
				if (!['Да', 'Нет'].includes(variable.value)) variable.value = 'Да';
			},
			title: 'Логика'
		}
	];

	const removeVariable = () => {
		const variableIndex = findIndex(variablesStore.variables, (v) => v.name === variable.name);

		variablesStore.variables.splice(variableIndex, 1);

		checkUpdates();
	};
</script>

{#if panelStatesStore.editMode}
	<Input
		value={`${variable.name || 'Переменная'} = ${variable.value || 'значение'}`}
		disabled
		class="w-full"
	>
		{#snippet right()}
			<Button
				class={clm('text-red-500', redBackgroundColorStore.color)}
				onclick={removeVariable}
				size="sm"
			>
				<Icon this={XMark} class="size-4" />
			</Button>
		{/snippet}
	</Input>
{:else}
	<FormSplit>
		<Input
			bind:value={variable.name}
			class={clm('shrink-0', panelStatesStore.editMode ? 'grow' : 'w-[13rem]')}
			disabled={panelStatesStore.editMode}
			maxlength={15}
			oninput={checkUpdates}
			placeholder="Название"
			readonly={readonlyModeStore.isEnabled}
		>
			{#snippet right()}
				<Listbox
					size="sm"
					align="right"
					bind:value={variable.expect}
					list={types}
					onchange={checkUpdates}
					placeholder="Тип"
					readonly={readonlyModeStore.isEnabled}
				/>
			{/snippet}
		</Input>
		{#if variable.expect === 'Логика'}
			<Listbox
				align="inset"
				bind:value={variable.value}
				class="w-full !rounded-none !rounded-r-lg"
				list={[{ title: 'Да' }, { title: 'Нет' }]}
				onchange={checkUpdates}
				placeholder="Значение"
				readonly={readonlyModeStore.isEnabled}
			/>
		{:else}
			<Input
				bind:value={variable.value}
				class="w-full"
				maxlength={32}
				number={variable.expect !== 'Строка'}
				oninput={checkUpdates}
				placeholder="Значение"
				readonly={readonlyModeStore.isEnabled}
			/>
		{/if}
	</FormSplit>
{/if}
