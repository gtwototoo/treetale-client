<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import MainHeader from '$lib/components/modules/Header/MainHeader.svelte';
	import Panel from '$lib/components/modules/Panel/Panel.svelte';
	import { currentPanelStore } from '$lib/stores/main';
	import { getPageType } from '$lib/utils';
	import clsx from 'clsx';

	import '../app.postcss';

	$: pageType = getPageType($page.url.pathname);

	beforeNavigate(() => {
		currentPanelStore.clear();
	});
</script>

<svg width="0" height="0" aria-hidden="true" class="invisible absolute bg-transparent">
	<defs>
		<linearGradient
			id="linear-logo"
			x1="137"
			y1="0"
			x2="137"
			y2="442"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#FDBA74" />
			<stop offset="1" stop-color="#FC8E4D" />
		</linearGradient>
	</defs>
</svg>

{#if pageType == 'editing' || pageType === 'reading' || pageType === 'viewing'}
	<div
		class={clsx(
			'fixed left-0 flex h-full flex-col',
			$currentPanelStore.component ? 'right-96 max-lg:right-0' : 'right-0'
		)}
	>
		<svelte:component this={$page.data.header || MainHeader} />
		<slot />
	</div>
	{#if $currentPanelStore.component}
		<Panel class="ml-auto w-96" />
	{/if}
{:else}
	<div class="relative flex h-full w-full flex-col">
		<svelte:component this={$page.data.header || MainHeader} />
		<slot />
	</div>
{/if}
