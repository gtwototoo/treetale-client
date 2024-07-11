<script lang="ts">
	import { onMount } from 'svelte';

	import clsx from 'clsx';
	import { ArrowsPointingOut, Star } from 'svelte-heros-v2';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { bodyColorStore } from '$lib/stores/main';
	import { fullscreenStore } from '$lib/stores/reading';
	import { contrastText } from '$lib/utils';

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
		size="lg"
		variant="ghost"
	>
		<Icon class="size-6" type={Star} />
		<p class="mr-1">Поддержать</p>
	</Button>
	{#if fullscreenSupport}
		<Button
			class="header-button bg-contrast text-text"
			on:click={handleFulscreen}
			size="lg"
			variant="ghost"
		>
			<Icon class="size-6" type={ArrowsPointingOut} />
		</Button>
	{/if}
</Header>
