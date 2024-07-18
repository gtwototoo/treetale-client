<script lang="ts">
	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';
	import { ChevronDown, PencilSquare } from 'svelte-heros-v2';
	import { Button, Icon, Listbox } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

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
				'z-[2] bg-contrast-9 !px-2.5 !py-2',
				panelStatesStore.editMode && 'text-red-500'
			)}
			onclick={() => (panelStatesStore.editMode = !panelStatesStore.editMode)}
		>
			<Icon class="size-5" this={PencilSquare} />
		</Button>
	{:else}
		<div class="w-10 shrink-0"></div>
	{/if}
	<Listbox align="inset" class="w-full min-w-0" list={framesList} placeholder="Блок" size="lg">
		{#snippet children({ onclick })}
			<Button
				class={clm(
					'w-full justify-center bg-contrast-9 !px-2',
					(!isFramePanel || !framesList) && 'pointer-events-none !bg-opacity-20'
				)}
				{onclick}
			>
				{panelStatesStore.props?.title}
			</Button>
		{/snippet}
	</Listbox>
	<Button
		class="bg-contrast-9 px-2.5 py-2 xs:hidden"
		onclick={() => (panelStatesStore.show = !panelStatesStore.show)}
	>
		<Icon class={clm('size-5', !panelStatesStore.show && 'rotate-180')} this={ChevronDown} />
	</Button>
	<div class="w-10 shrink-0 max-xs:hidden"></div>
</div>
