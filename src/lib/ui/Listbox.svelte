<script lang="ts">
	import { Select } from 'melt/builders';
	import { ChevronDown } from 'svelte-heros-v2';

	import { clm } from '$lib/utils/classMerge';

	import Button from './Button.svelte';
	import FormSplit from './FormSplit.svelte';
	import Icon from './Icon.svelte';
	import { button } from './presets';
	import type { ChildrenSnippetProps, Placement } from './types';

	let {
		options,
		class: classname,
		placeholder = 'Выберите что-нибудь',
		disabled = false,
		readonly = false,
		value,
		onchange,
		sameWidth = true,
		placement = 'bottom'
	}: {
		options: ChildrenSnippetProps[];
		class?: string;
		placeholder?: string;
		disabled?: boolean;
		readonly?: boolean;
		value?: string;
		onchange?: (value: string) => void;
		sameWidth?: boolean;
		placement?: Placement;
	} = $props();

	let select = new Select<string>({
		value,
		onValueChange: (value) => onchange?.(value!),
		sameWidth,
		floatingConfig: {
			computePosition: {
				placement
			}
		}
	});
</script>

<Button
	{...select.trigger}
	inert={false}
	class={clm(
		button.type.primary,
		button.size.base,
		'justify-center gap-1',
		(disabled || readonly) && 'pointer-events-none',
		classname
	)}
>
	<p>{select.value || placeholder}</p>
	<Icon class="size-4" this={ChevronDown} />
</Button>

<div {...select.content} class="bg-contrast rounded-xl p-1 shadow-md">
	<FormSplit vertical>
		{#each options as { onclick, value } (value)}
			{@const { onclick: baseOnClick, ...other } = select.getOption(value)}
			<Button
				{...other}
				class={clm(button.type.primary, button.size.base, 'justify-center')}
				onclick={() => {
					onclick?.();
					baseOnClick();
				}}
			>
				{value}
			</Button>
		{/each}
	</FormSplit>
</div>
