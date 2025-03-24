<script lang="ts">
	import { onMount } from 'svelte';

	import { ArrowsPointingIn, ArrowsPointingOut } from 'svelte-heros-v2';

	import { fullscreenStore } from '$lib/stores/reading.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { button } from '$lib/ui/presets';
	import { clm } from '$lib/utils/classMerge';

	import Header from './index.svelte';

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
			class={clm(button.type.primary, button.size.lg, 'header-button')}
			onclick={handleFulscreen}
		>
			<Icon
				class="size-6"
				this={fullscreenStore.isEnabled ? ArrowsPointingIn : ArrowsPointingOut}
			/>
		</Button>
	{/if}
</Header>
