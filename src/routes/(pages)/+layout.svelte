<script lang="ts">
	import MainHeader from '$lib/components/Header/MainHeader.svelte';

	const { children } = $props();
</script>

<div class="relative flex min-h-screen w-full flex-col">
	<MainHeader />
	{@render children()}
</div>
