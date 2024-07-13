<script lang="ts">
	import { page } from '$app/stores';

	import MainHeader from '$lib/components/Header/MainHeader.svelte';
	import { getPageType } from '$lib/utils/page';

	import '../app.postcss';
	import '../fonts/RobotoSlab-Black.css';

	let { children } = $props();

	let pageType = $derived(getPageType($page.url.pathname));
</script>

<svg aria-hidden="true" class="invisible absolute bg-transparent" height="0" width="0">
	<defs>
		<linearGradient
			gradientUnits="userSpaceOnUse"
			id="linear-logo"
			x1="137"
			x2="137"
			y1="0"
			y2="442"
		>
			<stop stop-color="#FDBA74" />
			<stop offset="1" stop-color="#FC8E4D" />
		</linearGradient>
	</defs>
</svg>

{#if pageType == 'editing' || pageType === 'reading' || pageType === 'viewing'}
	<div class="fixed left-0 flex h-full flex-col">
		<svelte:component this={$page.data.header || MainHeader} />
		{@render children()}
	</div>
{:else}
	<div class="relative flex size-full flex-col">
		<svelte:component this={$page.data.header || MainHeader} />
		{@render children()}
	</div>
{/if}
