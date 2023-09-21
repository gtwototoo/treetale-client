<script lang="ts">
	import { page } from '$app/stores';
	import MainHeader from '$lib/components/modules/Header/MainHeader.svelte';
	import { currentPanelStore } from '$lib/stores/main';
	import { findByPattern } from '$lib/utils';

	import '../app.postcss';

	const getPageType = (path: string): 'edit' => {
		return findByPattern(path, {
			edit: /^\/\d+\/edit$/
		}) as 'edit';
	};

	$: pageType = getPageType($page.url.pathname);
</script>

<div class="flex h-full">
	<div class="flex flex-col text-black h-full w-full relative">
		<svelte:component this={$page.data.header || MainHeader} />
		<slot />
	</div>
	{#if pageType === 'edit'}
		<div class="w-96 bg-gray-100 shrink-0">
			{#if $currentPanelStore.component}
				<svelte:component this={$currentPanelStore.component} />
			{/if}
		</div>
	{/if}
</div>
