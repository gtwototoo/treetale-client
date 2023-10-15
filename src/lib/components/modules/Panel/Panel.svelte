<script lang="ts">
	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { currentPanelStore } from '$lib/stores/main';
	import { selectedFrameStore } from '$lib/stores/workspace';
	import clsx from 'clsx';
	import { PencilSquare, XMark } from 'svelte-heros-v2';
	import { InformationSettings } from '.';

	const closePanel = () => {
		currentPanelStore.clear();

		console.log($selectedFrameStore);
	};
</script>

<div class="w-96 bg-gray-100 shrink-0 p-4 flex flex-col gap-4 relative overflow-auto">
	{#if $currentPanelStore.hasEditButton}
		<Button
			size="lg"
			variant={$currentPanelStore.editMode ? 'main' : 'secondary'}
			class={clsx(
				'!absolute left-4 top-4 z-[2] !p-3',
				$currentPanelStore.editMode && 'bg-main text-text'
			)}
			on:click={currentPanelStore.switchEditMode}
		>
			<Icon type={PencilSquare} class="w-6 h-6" />
		</Button>
	{/if}
	{#if $currentPanelStore.component}
		<Button size="lg" class="!absolute right-4 top-4 z-[2] !p-3" on:click={closePanel}>
			<Icon type={XMark} class="w-6 h-6" />
		</Button>
	{/if}
	<p
		class="min-h-[3rem] w-full select-none flex justify-center items-center px-16 text-center text-lg font-medium"
	>
		{$currentPanelStore.title || 'Основная информация'}
	</p>
	<svelte:component this={$currentPanelStore.component || InformationSettings} />
</div>
