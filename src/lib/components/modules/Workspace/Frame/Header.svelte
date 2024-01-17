<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Button } from '$UI';
	import { activeModeStore } from '$lib/stores/workspace';
	import clsx from 'clsx';

	export let start = false;
	export let end = false;
	export let title: string;
	export let hidden: boolean;

	const dispatch = createEventDispatcher();

	const hideFrame = () => {
		dispatch('hide');
	};
</script>

<Button
	variant="main"
	class={clsx(
		'!text-text',
		start && '!text-emerald-500',
		end && '!text-blue-500',
		$activeModeStore === 'binding' ? '!bg-main-60' : '!bg-main-40'
	)}
	on:click={hideFrame}
>
	{start ? 'Начало' : title}
	<div class="leftBindPoint" />
	{#if hidden}
		<div class="rightBindPoint" />
	{/if}
</Button>
