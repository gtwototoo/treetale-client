<script lang="ts">
	import clsx from 'clsx';
	import { PencilSquare, XMark } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';

	$: editMode = $currentPanelStore.editMode;
</script>

<div
	class="relative ml-auto flex w-96 shrink-0 flex-col gap-4 overflow-auto bg-transparent p-4 text-text"
>
	{#if $currentPanelStore.hasEditButton && !$readonlyStore}
		<Button
			size="lg"
			variant={editMode ? 'main' : 'ghost'}
			class={clsx('!absolute left-4 top-4 z-[2] bg-main !p-3')}
			on:click={currentPanelStore.switchEditMode}
		>
			<Icon type={PencilSquare} class="h-6 w-6" />
		</Button>
	{/if}
	{#if $currentPanelStore.component && $currentPanelStore.hasCloseButton}
		<Button
			size="lg"
			variant="ghost"
			class="!absolute right-4 top-4 z-[2] bg-main !p-3"
			on:click={currentPanelStore.clear}
		>
			<Icon type={XMark} class="h-6 w-6" />
		</Button>
	{/if}
	<p
		class="flex min-h-[3rem] w-full select-none items-center justify-center px-16 text-center text-lg font-medium"
	>
		{$currentPanelStore.title}
	</p>
	<svelte:component this={$currentPanelStore.component} />
</div>
