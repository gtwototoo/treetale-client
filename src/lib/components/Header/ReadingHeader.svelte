<script lang="ts">
	import { onMount } from 'svelte';

	import { ArrowsPointingIn, ArrowsPointingOut } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import Header from './Header.svelte';

	import { fullscreenStore } from '$lib/stores/reading.svelte';

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

	const handleFulscreen = async () => {
		if (fullscreenStore.isEnabled) {
			await document.exitFullscreen();

			fullscreenStore.isEnabled = false;
		} else {
			try {
				await document.documentElement.requestFullscreen();

				fullscreenStore.isEnabled = true;
			} catch {
				fullscreenStore.isEnabled = false;
			}
		}
	};

	onMount(() => {
		if ('requestFullscreen' in document.documentElement) {
			fullscreenSupport = true;
		}
	});
</script>

<Header class="fixed">
	{#if fullscreenSupport}
		<Button
			class="header-button bg-main-50 text-text hover:bg-main-70"
			onclick={handleFulscreen}
			size="lg"
		>
			<Icon
				class="size-6"
				this={fullscreenStore.isEnabled ? ArrowsPointingIn : ArrowsPointingOut}
			/>
		</Button>
	{/if}
</Header>
