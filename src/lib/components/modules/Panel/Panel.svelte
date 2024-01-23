<script lang="ts">
	import clsx from 'clsx';
	import { ArrowsPointingIn, PencilSquare, XMark } from 'svelte-heros-v2';

	import { Button, Listbox } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';
	import { framesDataStore } from '$lib/stores/workspace';
	import { clm } from '$lib/utils';
	import { setSelectedFrame } from '../Workspace/methods';

	let className = '';
	export { className as class };

	export let title: string;
	export let nonClose = false;
	export let nonEdit = false;

	$: ({ editMode, hidden } = $currentPanelStore);
	$: framePanel = $currentPanelStore.id.includes('frame');
	$: framesList = $framesDataStore.map((frame) => {
		return {
			title: frame.title,
			click: () => setSelectedFrame(frame)
		};
	});
</script>

<div
	class={clm(
		'relative ml-auto flex min-h-full w-96 max-w-full shrink-0 flex-col gap-4 bg-contrast px-4 py-4 text-text transition-transform max-sm:py-3 max-xs:px-3',
		className,
		hidden && 'max-lg:translate-x-full'
	)}
>
	<div class="flex w-full gap-2">
		{#if !nonEdit && !$readonlyStore}
			<Button
				size="lg"
				variant="ghost"
				class={clsx('bg-contrast-9 z-[2] !p-3', editMode && 'text-red-500')}
				on:click={currentPanelStore.switchEditMode}
			>
				<Icon type={PencilSquare} class="h-6 w-6" />
			</Button>
		{:else}
			<div class="w-12" />
		{/if}
		<Listbox
			size="lg"
			list={framesList}
			placeholder="Блок"
			class="w-full"
			align="inset"
			let:click
		>
			<Button
				size="lg"
				variant="ghost"
				class={clsx(
					'bg-contrast-9 w-full justify-center whitespace-normal !px-2',
					(!framePanel || !framesList) && 'pointer-events-none !bg-opacity-20'
				)}
				on:click={click}
			>
				{title}
			</Button>
		</Listbox>
		{#if $currentPanelStore.component && !nonClose}
			<Button
				size="lg"
				variant="ghost"
				class="bg-contrast-9 !p-3 max-lg:!hidden"
				on:click={currentPanelStore.clear}
			>
				<Icon type={XMark} class="h-6 w-6" />
			</Button>
		{:else}
			<div class="w-12 max-lg:!hidden" />
		{/if}
		<Button
			size="lg"
			variant="ghost"
			class="bg-contrast-9 !hidden !p-3 max-lg:!block"
			on:click={currentPanelStore.switchVisible}
		>
			<Icon type={ArrowsPointingIn} class="h-6 w-6" />
		</Button>
	</div>
	<slot />
</div>
