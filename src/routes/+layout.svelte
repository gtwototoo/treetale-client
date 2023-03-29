<script>
	import Header from '$lib/components/modules/Header';
	import Panel from '$lib/components/modules/Panel';
	import { activeActions } from '$lib/stores/editing';
	import { currentPanel } from '$lib/stores/main';
	import { mainColor } from '$lib/stores/story';
	import { rootStyle } from '$lib/utils';
	import clsx from 'clsx';
	import '../app.postcss';
</script>

<svelte:head>
	<title>TreeStory</title>
	{@html rootStyle($mainColor)}
</svelte:head>

<div class="flex flex-col text-black">
	<Header />
	<Panel
		on:click={currentPanel.clear}
		class={clsx('transition-opacity', $activeActions ? 'blind' : 'pointer-events-auto')}
		title={$currentPanel.title}
	>
		<svelte:component this={$currentPanel.component} />
	</Panel>
	<slot />
</div>
