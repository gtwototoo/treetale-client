<script>
	import Header from '$lib/components/modules/Header';
	import Panel from '$lib/components/modules/Panel';
	import { activeAction } from '$lib/stores/editing';
	import { currentHeader, currentPanel } from '$lib/stores/main';
	import clsx from 'clsx';
	import '../app.postcss';
</script>

<svelte:head>
	<title>TreeStory</title>
</svelte:head>

<div class="flex flex-col text-black">
	<Header>
		<svelte:component this={$currentHeader} />
	</Header>
	{#if $currentPanel.component}
		<Panel
			on:click={currentPanel.clear}
			class={clsx('transition-opacity', $activeAction ? 'blind' : 'pointer-events-auto')}
			title={$currentPanel.title}
		>
			<svelte:component this={$currentPanel.component} />
		</Panel>
	{/if}
	<slot />
</div>
