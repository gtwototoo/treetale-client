<script lang="ts">
	import { page } from '$app/stores';
	import MainHeader from '$lib/components/modules/Header/MainHeader.svelte';
	import Panel from '$lib/components/modules/Panel/Panel.svelte';
	import { getPageType } from '$lib/utils';

	import '../app.postcss';

	$: pageType = getPageType($page.url.pathname);
</script>

{#if pageType == 'editing'}
	<div class="fixed left-0 right-96 flex h-screen w-auto flex-col">
		<svelte:component this={$page.data.header || MainHeader} />
		<slot />
	</div>
	<div class="fixed right-0 h-full w-96 bg-contrast" />
	<Panel />
{:else}
	<div class="relative flex h-full w-full flex-col">
		<svelte:component this={$page.data.header || MainHeader} />
		<slot />
	</div>
{/if}
