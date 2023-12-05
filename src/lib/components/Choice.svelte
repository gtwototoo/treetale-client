<script lang="ts">
	import { Button } from '$UI';

	export let active: boolean;
</script>

<Button
	on:click
	variant={active ? 'main' : 'ghost'}
	class="adaptive-font adaptive-padding !whitespace-normal bg-main text-left !text-text"
>
	<slot />
</Button>
