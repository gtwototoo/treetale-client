<script>
	import { page } from '$app/stores';
	import MainHeader from '$lib/components/modules/Header/MainHeader.svelte';

	import '../app.postcss';
</script>

<div class="flex flex-col text-black">
	<svelte:component this={$page.data.header || MainHeader} />
	<slot />
</div>
