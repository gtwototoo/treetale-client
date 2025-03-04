<script lang="ts">
	import { onDestroy } from 'svelte';

	import { ChevronRight } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { clm } from '$lib/utils/classMerge';

	import { panelStatesStore } from '$board/stores/panel.svelte';

	import Header from './Header.svelte';
	import Tabs from './Tabs.svelte';

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
	class="text-text max-fd:w-full max-fd:items-end max-fd:px-0 pointer-events-none z-10 flex min-h-full justify-end p-1"
>
	<div
		class={clm(
			'bg-contrast max-fd:w-full fd:min-h-full pointer-events-auto relative flex w-96 shrink-0 flex-col rounded-2xl transition-transform',
			!panelStatesStore.show &&
				'max-fd:bottom-16 max-fd:translate-y-full max-lg:fd:right-1 max-lg:fd:translate-x-full max-lg:absolute'
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
				class="bg-contrast text-text absolute right-full bottom-full rounded-r-none p-3 pr-1 lg:hidden"
				onclick={() => (panelStatesStore.show = !panelStatesStore.show)}
			>
				<Icon this={ChevronRight} class={clm('size-6', !panelStatesStore.show && 'rotate-180')} />
			</Button>
		</div>
	</div>
</div>
