<script lang="ts">
	import { DEFAULT_COLOR } from '$lib/constants/colors';
	import { bodyBackgroundColorStore, theme } from '$lib/stores/colors.svelte';
	import type { RGB } from '$lib/types';
	import { rootStyle } from '$lib/utils/customColors';

	const {
		init = DEFAULT_COLOR
	}: {
		init?: RGB;
	} = $props();

	let currentColor = $state(init);

	bodyBackgroundColorStore.color = init;

	$effect(() => {
		currentColor = bodyBackgroundColorStore.color;
	});
</script>

<svelte:head>
	{@html rootStyle(currentColor, {}, theme.type)}
</svelte:head>
