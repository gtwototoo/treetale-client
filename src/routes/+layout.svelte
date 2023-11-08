<script lang="ts">
	import { page } from '$app/stores';
	import MainHeader from '$lib/components/modules/Header/MainHeader.svelte';
	import Panel from '$lib/components/modules/Panel/Panel.svelte';
	import { getPageType } from '$lib/utils';

	import '../app.postcss';

	$: pageType = getPageType($page.url.pathname);
</script>

{#if pageType == 'editing'}
	<div class="flex flex-col h-screen fixed left-0 right-96 w-auto">
		<svelte:component this={$page.data.header || MainHeader} />
		<slot />
	</div>
	<div class="fixed right-0 h-full w-96 bg-contrast" />
	<Panel />
{:else}
	<div class="flex flex-col h-full w-full relative">
		<svelte:component this={$page.data.header || MainHeader} />
		<slot />
	</div>
{/if}
