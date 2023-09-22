<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { currentPanelStore } from '$lib/stores/main';
	import { Button } from '$UI';
	import { XMark } from 'svelte-heros-v2';
</script>

<div class="w-96 bg-gray-100 shrink-0 p-4 flex flex-col gap-4">
	<Button size="lg" class="!absolute right-4 top-4 z-[2] !p-3" on:click>
		<Icon type={XMark} class="w-6 h-6" />
	</Button>
	{#if $currentPanelStore.title}
		<p
			class="min-h-[3rem] w-full select-none flex justify-center items-center px-16 text-center text-lg font-medium"
		>
			{$currentPanelStore.title}
		</p>
	{/if}
	{#if $currentPanelStore.component}
		<svelte:component this={$currentPanelStore.component} />
	{/if}
</div>
