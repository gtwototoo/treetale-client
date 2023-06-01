<script lang="ts">
	import { storyInfo } from '$lib/stores/editing';
	import { activeActionStore } from '$lib/stores/newediting';
	import clsx from 'clsx';
	import Radar from './Radar.svelte';
	import StateMode from './StateMode.svelte';
</script>

<div class="area">
	<div class={clsx('footer', $activeActionStore !== 'view' ? 'blind' : 'pointer-events-auto')}>
		<Radar />
		<div class="info">
			<p>
				{$storyInfo.offset.x}, {$storyInfo.offset.y}
			</p>
			<p>
				{($storyInfo.scale / 100).toFixed(1)}x
			</p>
		</div>
	</div>
	<StateMode />
</div>

<style lang="postcss">
	.area {
		@apply pointer-events-none fixed bottom-0 flex w-full items-end justify-between bg-transparent p-2 transition-opacity sm:p-4;
	}
	.footer {
		@apply flex items-center gap-1;
	}
	.info {
		@apply flex select-none flex-col rounded-lg bg-main px-2 py-1 text-xs text-text;
	}
</style>
