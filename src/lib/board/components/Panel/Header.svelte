<script lang="ts">
	import { ChevronDown, ChevronLeft, Pencil } from 'svelte-heros-v2';

	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Listbox from '$lib/ui/Listbox.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import { boardFramesStore } from '$board/stores/frames.svelte';
	import { readonlyModeStore } from '$board/stores/index.svelte';
	import { panelStatesStore } from '$board/stores/panel.svelte';

	import { setSelectedFrame } from '../methods.svelte';

	let framesList = $derived(
		boardFramesStore.frames.map((frame) => {
			return {
				onclick: () => setSelectedFrame(frame),
				value: frame.title
			};
		})
	);

	let isFramePanel = $derived(panelStatesStore.id.includes('frame'));
</script>

<div class="flex w-full gap-2 p-3">
	{#if panelStatesStore.props?.isEdit && !readonlyModeStore.isEnabled}
		<Button
			class={clm(
				button.size.base,
				button.type.primary,
				'p-2.5',
				panelStatesStore.editMode && 'text-red-500'
			)}
			onclick={() => (panelStatesStore.editMode = !panelStatesStore.editMode)}
		>
			<Icon class="size-5" this={Pencil} />
		</Button>
	{:else}
		<div class="w-10 shrink-0"></div>
	{/if}
	{#if panelStatesStore.props?.isSubpanel}
		<Button
			class={clm(button.size.base, button.type.primary, 'w-full min-w-0 justify-center gap-2')}
			onclick={panelStatesStore.goBack}
		>
			<Icon this={ChevronLeft} class="absolute left-2 size-5" />
			<p class="ml-4 truncate">{panelStatesStore.props?.title}</p>
		</Button>
	{:else}
		<Listbox
			class={clm('w-full min-w-0', (!isFramePanel || !framesList) && 'bg-contrast-200')}
			options={framesList}
			placeholder={panelStatesStore.props?.title}
			disabled={!isFramePanel || !framesList}
		/>
	{/if}
	<Button
		class={clm(button.size.base, button.type.primary, 'fd:hidden p-2.5')}
		onclick={() => (panelStatesStore.show = !panelStatesStore.show)}
	>
		<Icon class={clm('size-5', !panelStatesStore.show && 'rotate-180')} this={ChevronDown} />
	</Button>
	<div class="max-fd:hidden w-10 shrink-0"></div>
</div>
