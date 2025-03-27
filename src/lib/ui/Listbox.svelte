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
		placement = 'bottom',
		hideArrow = false
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
		hideArrow?: boolean;
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
	disabled={disabled || readonly}
	class={clm(button.type.primary, button.size.base, 'gap-1.5', classname)}
>
	<p class="mr-5">{select.value || placeholder}</p>
	{#if !(disabled || readonly) && !hideArrow}
		<Icon class="absolute right-3 size-4 *:stroke-2" this={ChevronDown} />
	{/if}
</Button>

<div {...select.content} class="bg-contrast rounded-xl p-1 shadow-md">
	<FormSplit vertical>
		{#each options as { onclick, value }, key (key)}
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
