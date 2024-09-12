<script lang="ts">
	import { interfaceStore } from '$lib/stores/reading.svelte';

	const handleClick = () => {
		interfaceStore.show = !interfaceStore.show;
	};
</script>

<button class="pointer-events-auto absolute inset-0 -z-[1] cursor-default" onclick={handleClick}
></button>
