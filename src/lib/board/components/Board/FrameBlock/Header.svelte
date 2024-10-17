<script lang="ts">
	import { MusicalNote } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import type { Frame } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';

	import { isBindingMode } from '$board/stores/index.svelte';

	let {
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
		'justify-between text-text',
		start && 'text-emerald-500',
		end && 'text-blue-500',
		isBindingMode() ? '!bg-main-60' : '!bg-contrast-5'
	)}
	onclick={hideFrame}
>
	<p class="truncate">{title}</p>
	{#if soundUrl}
		<Icon class="size-4" this={MusicalNote} />
	{/if}

	<div
		class={clm(
			'leftBindPoint',
			(isSelected || isDragging) && 'after:to-text',
			isSelectedBindingChoice && 'group-hover:after:to-green-500',
			isDragging && 'after:-inset-1'
		)}
	></div>
	{#if hidden && hasConnections}
		<div
			class={clm(
				'rightBindPoint',
				(isSelected || isDragging) && 'after:to-text',
				isSelectedBindingChoice && 'group-hover:after:to-green-500',
				isDragging && 'after:-inset-1'
			)}
		></div>
	{/if}
</Button>
