<script lang="ts">
	import { ChevronDown, ChevronLeft, PencilSquare } from 'svelte-heros-v2';
	import { Button, Icon, Listbox } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import { setSelectedFrame } from '../methods.svelte';

	let framesList = $derived(
		boardFramesStore.frames.map((frame) => {
			return {
				onclick: () => setSelectedFrame(frame),
				title: frame.title
			};
		})
	);

	let isFramePanel = $derived(panelStatesStore.id.includes('frame'));
</script>

<div class="flex w-full gap-2 p-3">
	{#if panelStatesStore.props?.isEdit && !readonlyModeStore.isEnabled}
		<Button
			class={clm(
				'bg-contrast-7 hover:bg-contrast-9 z-[2] px-2.5 py-2',
				panelStatesStore.editMode && 'text-red-500'
			)}
			onclick={() => (panelStatesStore.editMode = !panelStatesStore.editMode)}
		>
			<Icon class="size-5" this={PencilSquare} />
		</Button>
	{:else}
		<div class="w-10 shrink-0"></div>
	{/if}
	{#if panelStatesStore.props?.isSubpanel}
		<Button
			class="bg-contrast-7 hover:bg-contrast-9 w-full justify-center !px-2"
			onclick={panelStatesStore.goBack}
		>
			<Icon this={ChevronLeft} class="absolute left-3 size-5" />
			<p class="truncate">{panelStatesStore.props?.title}</p>
		</Button>
	{:else}
		<Listbox align="inset" class="w-full min-w-0" list={framesList} placeholder="Блок">
			{#snippet children({ onclick })}
				<Button
					class={clm(
						'bg-contrast-7 hover:bg-contrast-9 w-full justify-center !px-2',
						(!isFramePanel || !framesList) && '!bg-opacity-20 pointer-events-none'
					)}
					{onclick}
				>
					<p class="truncate">{panelStatesStore.props?.title}</p>
				</Button>
			{/snippet}
		</Listbox>
	{/if}
	<Button
		class="bg-contrast-7 hover:bg-contrast-9 xs:hidden px-2.5 py-2"
		onclick={() => (panelStatesStore.show = !panelStatesStore.show)}
	>
		<Icon class={clm('size-5', !panelStatesStore.show && 'rotate-180')} this={ChevronDown} />
	</Button>
	<div class="max-xs:hidden w-10 shrink-0"></div>
</div>
