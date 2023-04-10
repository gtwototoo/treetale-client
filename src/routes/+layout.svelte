<script>
	import { page } from '$app/stores';
	import Header from '$lib/components/modules/Header';
	import Main from '$lib/components/modules/Header/Main.svelte';
	import Panel from '$lib/components/modules/Panel';
	import { currentPanel } from '$lib/stores/main';
	import { activeAction } from '$lib/stores/newediting';
	import clsx from 'clsx';
	import '../app.postcss';
</script>

<div class="flex flex-col text-black">
	<Header>
		<svelte:component this={$page.data.header || Main} />
	</Header>
	{#if $currentPanel.component}
		<Panel
			on:click={currentPanel.clear}
			class={clsx(
				'transition-opacity',
				$activeAction !== 'view' ? 'blind' : 'pointer-events-auto'
			)}
			title={$currentPanel.title}
		>
			<svelte:component this={$currentPanel.component} />
		</Panel>
	{/if}
	<slot />
</div>
