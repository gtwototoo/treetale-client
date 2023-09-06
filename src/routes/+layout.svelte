<script>
	import { page } from '$app/stores';
	import MainHeader from '$lib/components/modules/Header/MainHeader.svelte';
	import Panel from '$lib/components/modules/Panel';
	import { currentPanelStore } from '$lib/stores/main';
	import { activeActionStore } from '$lib/stores/newediting';
	import clsx from 'clsx';
	import '../app.postcss';
</script>

<div class="flex flex-col text-black">
	<svelte:component this={$page.data.header || MainHeader} />
	{#if $currentPanelStore.component}
		<Panel
			on:click={currentPanelStore.clear}
			class={clsx(
				'transition-opacity',
				$activeActionStore !== 'view' ? 'blind' : 'pointer-events-auto'
			)}
			title={$currentPanelStore.title}
		>
			<svelte:component this={$currentPanelStore.component} />
		</Panel>
	{/if}
	<slot />
</div>
