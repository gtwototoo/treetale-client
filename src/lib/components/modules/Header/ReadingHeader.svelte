<script lang="ts">
	import clsx from 'clsx';
	import { ArrowsPointingOut, Star } from 'svelte-heros-v2';

	import Header from './Header.svelte';

	import { Button } from '$UI';
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import { bodyColorStore } from '$lib/stores/main';
	import { fullscreenStore } from '$lib/stores/reading';
	import { contrastText, getPageType } from '$lib/utils';

	const handleFulscreen = async () => {
		try {
			await document.getElementById('read-screen').requestFullscreen();

			$fullscreenStore = true;
		} catch {
			$fullscreenStore = false;
		}
	};

	$: pageType = getPageType($page.url.pathname);
</script>

<Header class={clsx(pageType === 'reading' && 'fixed')}>
	<Button
		class={clsx(
			'header-button text-text',
			contrastText($bodyColorStore) ? 'bg-yellow-600' : 'bg-yellow-300'
		)}
		variant="ghost"
		size="lg"
	>
		<Icon type={Star} class="h-6 w-6" />
		<p class="mr-1">Поддержать</p>
	</Button>
	<Button
		variant="ghost"
		class="header-button bg-contrast text-text"
		size="lg"
		on:click={handleFulscreen}
	>
		<Icon type={ArrowsPointingOut} class="h-6 w-6" />
	</Button>
</Header>
