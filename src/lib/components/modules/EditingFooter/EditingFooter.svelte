<script lang="ts">
	import { Button } from '$UI';
	import { storyInfo } from '$lib/stores/editing';
	import { activeActionStore } from '$lib/stores/newediting';
	import clsx from 'clsx';
	import Radar from './Radar.svelte';
	import StateMode from './StateMode.svelte';

	export let viewArea: HTMLDivElement;
</script>

<div class="area">
	<div
		class={clsx(
			'flex items-center',
			$activeActionStore !== 'view' ? 'blind' : 'pointer-events-auto'
		)}
	>
		<Radar {viewArea} />
		<div class="info">
			<p>
				{$storyInfo.offset.x}, {$storyInfo.offset.y}
			</p>
			<p>
				{($storyInfo.scale / 100).toFixed(1)}x
			</p>
		</div>
	</div>
	<Button
		variant="ghost"
		size="lg"
		class="w-64 bg-emerald-300 text-emerald-500 pointer-events-auto justify-center"
	>
		Новый фрейм
	</Button>
	<StateMode />
</div>

<style lang="postcss">
	.area {
		@apply pointer-events-none absolute bottom-0 flex w-full items-center justify-between bg-transparent p-2 transition-opacity sm:p-4;
	}
	.footer {
		@apply flex items-center gap-1;
	}
	.info {
		@apply flex select-none flex-col rounded-lg bg-main px-2 py-1 text-sm text-text;
	}
</style>
