<script lang="ts">
	import { MusicalNote } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import type { Frame } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';

	import { isBindingMode } from '$board/stores/index.svelte';

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
		'text-text justify-between',
		start && 'text-emerald-500',
		end && 'text-blue-500',
		isBindingMode() ? '!bg-main-600' : '!bg-contrast-500'
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
			isSelectedBindingChoice && 'after:group-hover:to-green-500',
			isDragging && 'after:-inset-1'
		)}
	></div>
	{#if hidden && hasConnections}
		<div
			class={clm(
				'rightBindPoint',
				(isSelected || isDragging) && 'after:to-text',
				isSelectedBindingChoice && 'after:group-hover:to-green-500',
				isDragging && 'after:-inset-1'
			)}
		></div>
	{/if}
</Button>
