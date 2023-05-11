<script lang="ts">
	import { frames } from '$lib/stores/editing';
	import Frame from './Frame/Frame.svelte';
</script>

<div>
	{#each $frames as data, key (data.frameId)}
		<Frame {key} {data} />
	{/each}
</div>
