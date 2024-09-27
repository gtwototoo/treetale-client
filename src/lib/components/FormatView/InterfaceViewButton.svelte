<script lang="ts">
	import { interfaceStore } from '$lib/stores/reading.svelte';

	const handleClick = () => {
		interfaceStore.show = !interfaceStore.show;
	};
</script>

<div
	tabindex="0"
	role="button"
	onkeypress={() => null}
	class="pointer-events-auto absolute inset-0 -z-[1] cursor-default"
	onclick={handleClick}
></div>
