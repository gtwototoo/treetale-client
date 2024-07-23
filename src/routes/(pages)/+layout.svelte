<script lang="ts">
	import MainHeader from '$lib/components/Header/MainHeader.svelte';

	let { children } = $props();
</script>

<div class="relative flex min-h-screen w-full flex-col">
	<MainHeader />
	{@render children()}
</div>
