<script lang="ts">
	import clsx from 'clsx';
	import { ArrowsPointingOut, Star } from 'svelte-heros-v2';

	import Header from './Header.svelte';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { bodyColorStore, currentPanelStore } from '$lib/stores/main';
	import { fullscreenStore } from '$lib/stores/reading';
	import { contrastText } from '$lib/utils';
	import { onMount } from 'svelte';
	import Donut from '../Panel/Donut.svelte';

	let fullscreenSupport = false;

	// const fullScreen = async (element: HTMLElement) => {
	// 	if (element.requestFullscreen) {
	// 		await element.requestFullscreen();
	// 	} else if (element.webkitrequestFullscreen) {
	// 		await element.webkitRequestFullscreen();
	// 	} else if (element.mozRequestFullscreen) {
	// 		await element.mozRequestFullScreen();
	// 	}
	// };

	const openDonutPanel = () => {
		$currentPanelStore = {
			id: 'donut',
			component: Donut
		};
	};

	const handleFulscreen = async () => {
		const readScreen = document.getElementById('read-screen') as HTMLDivElement;

		try {
			await readScreen.requestFullscreen();

			$fullscreenStore = true;
		} catch {
			$fullscreenStore = false;
		}
	};

	onMount(() => {
		if (document.documentElement.requestFullscreen) {
			fullscreenSupport = true;
		}
	});
</script>

<Header>
	<Button
		class={clsx(
			'header-button text-text',
			contrastText($bodyColorStore) ? 'bg-yellow-600' : 'bg-yellow-300'
		)}
		variant="ghost"
		size="lg"
		on:click={openDonutPanel}
	>
		<Icon type={Star} class="h-6 w-6" />
		<p class="mr-1">Поддержать</p>
	</Button>
	{#if fullscreenSupport}
		<Button
			variant="ghost"
			class="header-button bg-contrast text-text"
			size="lg"
			on:click={handleFulscreen}
		>
			<Icon type={ArrowsPointingOut} class="h-6 w-6" />
		</Button>
	{/if}
</Header>
