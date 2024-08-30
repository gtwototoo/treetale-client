<script lang="ts">
	import { onMount } from 'svelte';

	import { ArrowsPointingOut } from 'svelte-heros-v2';
	import { Button, Icon } from 'treetale-ui';

	import { fullscreenStore } from '$lib/stores/reading.svelte';

	import Header from './Header.svelte';

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
		const readScreen = document.getElementById('read-screen') as HTMLDivElement;

		try {
			await readScreen.requestFullscreen();

			fullscreenStore.isEnabled = true;
		} catch {
			fullscreenStore.isEnabled = false;
		}
	};

	onMount(() => {
		if (document.documentElement.requestFullscreen) {
			fullscreenSupport = true;
		}
	});
</script>

<Header>
	{#if fullscreenSupport}
		<Button
			class="header-button bg-main-50 text-text hover:bg-main-70"
			onclick={handleFulscreen}
			size="lg"
		>
			<Icon class="size-6" this={ArrowsPointingOut} />
		</Button>
	{/if}
</Header>
