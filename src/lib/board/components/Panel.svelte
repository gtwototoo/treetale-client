<script lang="ts">
	import { onDestroy } from 'svelte';

	import { ChevronRight } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	import { panelStatesStore } from '$board/stores/panel.svelte';

	import Header from './Panel/Header.svelte';
	import Tabs from './Panel/Tabs.svelte';

	let CurrentPanel = $derived(panelStatesStore.component);

	const switchHiddenOverflow = (hidden: boolean) => {
		document.body.classList[hidden ? 'add' : 'remove'](clm('max-lg:overflow-hidden'));
	};

	$effect(() => {
		switchHiddenOverflow(!panelStatesStore.show);
	});

	onDestroy(() => switchHiddenOverflow(false));
</script>

<div
	class="pointer-events-none absolute right-0 z-10 flex min-h-full p-1 text-text max-xs:w-full max-xs:items-end max-xs:px-0"
>
	<div
		class={clm(
			'pointer-events-auto relative flex w-96 flex-col rounded-2xl bg-contrast transition-transform max-xs:w-full xs:min-h-full',
			!panelStatesStore.show &&
				'max-lg:absolute max-xs:bottom-16 max-xs:translate-y-full max-lg:xs:right-1 max-lg:xs:translate-x-full'
		)}
	>
		<Tabs />
		<Header />
		<div class="flex grow flex-col gap-3 p-3 pt-0">
			{#if panelStatesStore.component}
				<CurrentPanel {...panelStatesStore.props} />
			{/if}
		</div>
		<div class="sticky bottom-24">
			<Button
				class="absolute bottom-full right-full rounded-r-none bg-contrast p-3 pr-1 text-text lg:hidden"
				onclick={() => (panelStatesStore.show = !panelStatesStore.show)}
			>
				<Icon
					this={ChevronRight}
					class={clm('size-6', !panelStatesStore.show && 'rotate-180')}
				/>
			</Button>
		</div>
	</div>
</div>
