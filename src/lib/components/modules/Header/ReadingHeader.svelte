<script lang="ts">
	import clsx from 'clsx';
	import { ArrowsPointingOut, Star } from 'svelte-heros-v2';

	import Header from './Header.svelte';

	import { Button } from '$UI';
	import Icon from '$lib/components/Icon.svelte';
	import { bodyColorStore, currentPanelStore } from '$lib/stores/main';
	import { fullscreenStore } from '$lib/stores/reading';
	import { contrastText } from '$lib/utils';
	import Donut from '../Panel/Donut.svelte';

	const openDonutPanel = () => {
		$currentPanelStore = {
			id: 'donut',
			title: 'Поддержать автора',
			component: Donut
		};
	};

	const handleFulscreen = async () => {
		try {
			await document.getElementById('read-screen').requestFullscreen();

			$fullscreenStore = true;
		} catch {
			$fullscreenStore = false;
		}
	};
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
	<Button
		variant="ghost"
		class="header-button bg-contrast text-text"
		size="lg"
		on:click={handleFulscreen}
	>
		<Icon type={ArrowsPointingOut} class="h-6 w-6" />
	</Button>
</Header>
