<script lang="ts">
	import AddFrameButton from './Footer/AddFrameButton.svelte';
	import BoardStateSwitch from './Footer/BoardStateSwitch.svelte';
	import Radar from './Footer/Radar.svelte';

	import { readonlyModeStore } from '$board/stores/index.svelte';
</script>

<div
	class="pointer-events-none fixed inset-x-0 bottom-0 flex items-end justify-between p-4 *:pointer-events-auto max-sm:p-3 max-xs:mb-16 lg:mr-[24.5rem]"
>
	<Radar />
	{#if !readonlyModeStore.isEnabled}
		<div class="absolute z-0 flex items-center justify-center max-xs:right-20 xs:w-full">
			<AddFrameButton />
		</div>
	{/if}
	<BoardStateSwitch />
</div>
