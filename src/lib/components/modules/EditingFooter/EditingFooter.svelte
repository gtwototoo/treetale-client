<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { activeAction, storyInfo } from '$lib/stores/editing';
	import clsx from 'clsx';
	import { MagnifyingGlassPlus, MapPin } from 'svelte-heros-v2';
	import Radar from './Radar.svelte';
	import StateMode from './StateMode.svelte';
</script>

<div class={clsx('area', $activeAction ? 'blind' : 'childs:pointer-events-auto')}>
	<div class="footer">
		<Radar />
		<div class="info">
			<div>
				<Icon type={MapPin} class="h-4 w-4" />
				{$storyInfo.grabbingOffsets.x}, {$storyInfo.grabbingOffsets.y}
			</div>
			<div>
				<Icon type={MagnifyingGlassPlus} class="h-4 w-4" />
				{($storyInfo.grabbingScale / 100).toFixed(1)}x
			</div>
		</div>
	</div>
	<StateMode />
</div>

<style lang="postcss">
	.area {
		@apply pointer-events-none fixed bottom-0 flex w-full items-end justify-between p-2 transition-opacity sm:p-4;
	}
	.footer {
		@apply flex items-center gap-2;
	}
	.info {
		@apply flex select-none flex-col gap-1 bg-transparent text-sm childs:flex childs:gap-2 childs:leading-4;
	}
</style>
