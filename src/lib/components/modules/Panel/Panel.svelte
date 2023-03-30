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

<div class="absolute right-0 mt-2 flex max-w-full bg-transparent px-2 sm:mt-4 sm:px-4">
	<div class={clsx('panel', classes)} in:fly={{ x: 10 }} out:fly={{ x: 10 }}>
		<Button size="sm" class="!absolute top-4 left-4" on:click>
			<Icon type={XMark} />
		</Button>
		{#if title}
			<p class="min-h-[2.5rem] w-full p-4 px-20 text-center text-lg font-medium">{title}</p>
		{/if}
		<div class="flex flex-col">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss">
	.panel {
		@apply flex max-h-[calc(100vh-5.75rem)] w-96 flex-col overflow-auto rounded-lg bg-white shadow-lg childs:w-full childs:bg-transparent;
	}
</style>
