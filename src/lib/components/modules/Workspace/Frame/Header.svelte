<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Button } from '$UI';
	import { activeModeStore } from '$lib/stores/workspace';
	import type { IChoice } from '$lib/types';
	import clsx from 'clsx';

	export let start = false;
	export let end = false;
	export let title: string;
	export let hidden: boolean;
	export let choices: Array<IChoice>;

	const dispatch = createEventDispatcher();

	const hideFrame = () => {
		dispatch('hide');
	};

	$: hasConnections = choices.some(({ frameId }) => frameId);
</script>

<Button
	variant="main"
	class={clsx(
		'!text-text',
		start && '!text-emerald-500',
		end && '!text-blue-500',
		$activeModeStore === 'binding' ? '!bg-main-60' : '!bg-contrast-5'
	)}
	on:click={hideFrame}
>
	{title}
	<div class="leftBindPoint" />
	{#if hidden && hasConnections}
		<div class="rightBindPoint" />
	{/if}
</Button>
