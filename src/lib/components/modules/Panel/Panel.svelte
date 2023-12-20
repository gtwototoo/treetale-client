<script lang="ts">
	import clsx from 'clsx';
	import {
		ArrowsPointingIn,
		ChevronLeft,
		ChevronRight,
		PencilSquare,
		XMark
	} from 'svelte-heros-v2';

	import { Button, FormSplit, Listbox } from '$UI';
	import type { IList } from '$UI/Listbox.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { readonlyStore } from '$lib/stores/editing';
	import { currentPanelStore } from '$lib/stores/main';
	import { framesDataStore } from '$lib/stores/workspace';
	import { nextSelectedFrame, prevSelectedFrame, setSelectedFrame } from '../Workspace/methods';

	let className = '';
	export { className as class };

	const framesList: IList[] = $framesDataStore.map((frame) => {
		return {
			text: frame.title || 'Начало',
			click: () => setSelectedFrame(frame)
		};
	});

	$: editMode = $currentPanelStore.editMode;
	$: hidden = $currentPanelStore.hidden;
	$: framePanel = $currentPanelStore.id.includes('frame');
</script>

<div
	class={clsx(
		'fixed right-0 h-full w-96 max-w-full bg-contrast transition-transform',
		hidden && 'max-lg:translate-x-full'
	)}
/>
<div
	class={clsx(
		'relative flex max-w-full shrink-0 flex-col gap-4 p-4 text-text transition-transform max-sm:py-3 max-xs:p-3',
		className,
		hidden && 'max-lg:translate-x-full'
	)}
>
	<div class="flex w-full gap-2">
		{#if $currentPanelStore.hasEditButton && !$readonlyStore}
			<Button
				size="lg"
				variant={editMode ? 'main' : 'ghost'}
				class={clsx('z-[2] bg-main !p-3')}
				on:click={currentPanelStore.switchEditMode}
			>
				<Icon type={PencilSquare} class="h-6 w-6" />
			</Button>
		{/if}
		<FormSplit class="w-full divide-contrast">
			{#if framePanel}
				<Button size="lg" variant="ghost" class="bg-main !p-2" on:click={prevSelectedFrame}>
					<Icon type={ChevronLeft} class="h-5 w-5" />
				</Button>
			{/if}
			<Listbox
				size="lg"
				list={framesList}
				placeholder="Фрейм"
				class="w-full"
				align="inset"
				let:click
			>
				<Button
					size="lg"
					variant="ghost"
					class={clsx(
						'w-full justify-center whitespace-normal bg-main !px-2',
						framePanel && '!rounded-none'
					)}
					on:click={click}
				>
					{$currentPanelStore.title}
				</Button>
			</Listbox>
			{#if framePanel}
				<Button size="lg" variant="ghost" class="bg-main !p-2" on:click={nextSelectedFrame}>
					<Icon type={ChevronRight} class="h-5 w-5" />
				</Button>
			{/if}
		</FormSplit>
		{#if $currentPanelStore.component && $currentPanelStore.hasCloseButton}
			<Button
				size="lg"
				variant="ghost"
				class="bg-main !p-3 max-lg:!hidden"
				on:click={currentPanelStore.clear}
			>
				<Icon type={XMark} class="h-6 w-6" />
			</Button>
		{/if}
		<Button
			size="lg"
			variant="ghost"
			class="!hidden bg-main !p-3 max-lg:!block"
			on:click={currentPanelStore.switchVisible}
		>
			<Icon type={ArrowsPointingIn} class="h-6 w-6" />
		</Button>
	</div>
	<svelte:component this={$currentPanelStore.component} />
</div>
