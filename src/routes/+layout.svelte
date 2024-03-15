<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import clsx from 'clsx';

	import MainHeader from '$lib/components/modules/Header/MainHeader.svelte';
	import { panelStore } from '$lib/stores/panel';
	import { getPageType } from '$lib/utils';

	import '../app.postcss';
	import '../fonts/RobotoSlab-Black.css';

	$: pageType = getPageType($page.url.pathname);

	beforeNavigate(() => {
		panelStore.clear();
	});
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
	<div
		class={clsx(
			'fixed left-0 flex h-full flex-col',
			$panelStore.component ? 'right-96 max-lg:right-0' : 'right-0'
		)}
	>
		<svelte:component this={$page.data.header || MainHeader} />
		<slot />
	</div>

	{#if $panelStore.component}
		<svelte:component this={$panelStore.component} />
	{/if}
{:else}
	<div class="relative flex h-full w-full flex-col">
		<svelte:component this={$page.data.header || MainHeader} />
		<slot />
	</div>
{/if}
