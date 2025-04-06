<script lang="ts">
	import { MusicalNote } from 'svelte-heros-v2';

	import type { Frame } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	const {
		end,
		frame,
		isDragging,
		isSelected,
		isSelectedBindingChoice,
		onhide,
		start
	}: {
		end: boolean;
		frame: Frame;
		isDragging: boolean;
		isSelected: boolean;
		isSelectedBindingChoice: boolean;
		onhide: () => void;
		start: boolean;
	} = $props();

	const hideFrame = () => {
		onhide();
	};

	const { choices, hidden, soundUrl, title } = $derived(frame);
	const hasConnections = $derived(choices.some(({ frameId }) => frameId));
</script>

<Button
	class={clm(
		button.size.base,
		button.type.primary,
		'justify-between py-3',
		start && 'text-emerald-500',
		end && 'text-blue-500'
	)}
	onclick={hideFrame}
>
	<p class="truncate">{title}</p>
	{#if soundUrl}
		<Icon class="size-4" this={MusicalNote} />
	{/if}

	<div
		class={clm(
			'left-bind-point group-hover/block:after:!to-text',
			(isSelected || isDragging) && 'after:!to-text',
			isSelectedBindingChoice && 'after:!to-emerald-500',
			isDragging && 'after:!-inset-1.25'
		)}
	></div>
	{#if hidden && hasConnections}
		<div
			class={clm(
				'right-bind-point group-hover/block:after:!to-text',
				(isSelected || isDragging) && 'after:!to-text',
				isSelectedBindingChoice && 'after:!to-emerald-500',
				isDragging && 'after:!-inset-1.25'
			)}
		></div>
	{/if}
</Button>
