<script lang="ts">
	import { readonlyModeStore } from '$board/stores/index.svelte';

	import AddFrameButton from './AddFrameButton.svelte';
	import BoardStateSwitch from './BoardStateSwitch.svelte';
	import Radar from './Radar.svelte';
</script>

<div
	class="max-xs:mb-16 pointer-events-none fixed inset-x-0 bottom-0 flex items-end justify-between p-4 *:pointer-events-auto max-sm:p-3 lg:mr-[24.5rem]"
>
	<Radar />
	{#if !readonlyModeStore.isEnabled}
		<div class="max-xs:right-20 xs:w-full absolute z-0 flex items-center justify-center">
			<AddFrameButton />
		</div>
	{/if}
	<BoardStateSwitch />
</div>
