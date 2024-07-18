<script lang="ts">
	import { boardStateStore } from '$board/stores/index.svelte';
	import { MusicalNote } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import type { Frame } from '$lib/types';

	import { clm } from '$lib/utils/classMerge';

	let {
		end,
		frame,
		onhide,
		start
	}: {
		end: boolean;
		frame: Frame;
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
		boardStateStore.mode === 'binding' ? '!bg-main-60' : '!bg-contrast-5'
	)}
	onclick={hideFrame}
>
	{title}
	{#if soundUrl}
		<Icon class="size-4" this={MusicalNote} />
	{/if}

	<div class="leftBindPoint"></div>
	{#if hidden && hasConnections}
		<div class="rightBindPoint"></div>
	{/if}
</Button>
