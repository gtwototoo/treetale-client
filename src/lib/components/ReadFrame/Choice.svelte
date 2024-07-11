<script lang="ts">
	import { Button } from '$UI';

	export let active: boolean;
</script>

<Button
	class="adaptive-font adaptive-padding !whitespace-normal bg-main text-left !text-text"
	on:click
	variant={active ? 'main' : 'ghost'}
>
	<slot />
</Button>
