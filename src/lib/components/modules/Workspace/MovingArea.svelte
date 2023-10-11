<script lang="ts">
	import { offsetStore, zoomStore } from '$lib/stores/workspace';
	import { transform } from '$lib/utils';
</script>

<div class="absolute" style={transform($offsetStore, $zoomStore / 100)}>
	<slot />
</div>
