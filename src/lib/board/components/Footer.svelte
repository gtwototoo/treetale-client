<script lang="ts">
	import { readonlyModeStore } from '$board/stores/index.svelte';

	import AddFrameButton from './Footer/AddFrameButton.svelte';
	import BoardState from './Footer/BoardState.svelte';
	import Radar from './Footer/Radar.svelte';
</script>

<div
	class="pointer-events-none fixed inset-x-0 bottom-0 flex items-end justify-between p-4 *:pointer-events-auto max-xs:mb-16 lg:mr-[24.5rem]"
>
	<Radar />
	{#if !readonlyModeStore.isEnabled}
		<div class="absolute z-0 flex h-12 w-full items-center justify-center max-xs:relative">
			<AddFrameButton />
		</div>
	{/if}
	<BoardState />
</div>
