<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import clsx from 'clsx';
	import { MusicalNote } from 'svelte-heros-v2';

	import type { IFrameCreate } from '$lib/types/editing';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { activeModeStore } from '$lib/stores/workspace';

	export let start = false;
	export let end = false;
	export let frame: IFrameCreate;

	const dispatch = createEventDispatcher();

	const hideFrame = () => {
		dispatch('hide');
	};

	$: ({ choices, hidden, soundUrl, title } = frame);
	$: hasConnections = choices.some(({ frameId }) => frameId);
</script>

<Button
	class={clsx(
		'justify-between !text-text',
		start && '!text-emerald-500',
		end && '!text-blue-500',
		$activeModeStore === 'binding' ? '!bg-main-60' : '!bg-contrast-5'
	)}
	on:click={hideFrame}
	variant="main"
>
	{title}
	{#if soundUrl}
		<Icon class="size-4" type={MusicalNote} />
	{/if}

	<div class="leftBindPoint" />
	{#if hidden && hasConnections}
		<div class="rightBindPoint" />
	{/if}
</Button>
