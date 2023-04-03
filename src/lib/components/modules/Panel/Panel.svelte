<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { Button } from '$UI';
	import clsx from 'clsx';
	import { XMark } from 'svelte-heros-v2';
	import { fly } from 'svelte/transition';

	let classes: string = '';

	export { classes as class };
	export let title: string | undefined = undefined;
</script>

<div class={clsx('panel', classes)} in:fly={{ x: 10 }} out:fly={{ x: 10 }}>
	<Button size="sm" class="!absolute right-3 top-3 z-[2]" on:click>
		<Icon type={XMark} />
	</Button>
	{#if title}
		<p class="min-h-[2.5rem] w-full select-none p-4 px-20 text-center text-lg font-medium">
			{title}
		</p>
	{/if}
	<div class="bg-transparent">
		<slot />
	</div>
</div>

<style lang="postcss">
	.panel {
		@apply absolute right-4 top-16 z-20 flex max-h-[calc(100vh-5.75rem)] w-96 flex-col rounded-lg bg-gray-100 shadow childs:w-full childs:bg-transparent;
	}
</style>
