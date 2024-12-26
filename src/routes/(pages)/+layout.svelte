<script lang="ts">
	import MainHeader from '$lib/components/Header/MainHeader.svelte';
	import RootStyles from '$lib/components/RootStyles.svelte';

	const { children } = $props();
</script>

<RootStyles />

<div class="relative flex min-h-screen w-full flex-col">
	<MainHeader />
	{@render children()}
</div>
