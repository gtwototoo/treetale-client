<script lang="ts">
	import type { ICoordinates } from '$lib/types';
	import { transform } from '$lib/utils';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const zoom: Writable<number> = getContext('zoom');
	const offset: Writable<ICoordinates> = getContext('offset');
</script>

<div class="absolute" style={transform($offset, $zoom / 100)}>
	<slot />
</div>
