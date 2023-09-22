<script lang="ts">
	import { page } from '$app/stores';
	import MainHeader from '$lib/components/modules/Header/MainHeader.svelte';
	import Panel from '$lib/components/modules/Panel/Panel.svelte';
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
	{#if pageType === 'edit' && !$page.error}
		<Panel />
	{/if}
</div>
