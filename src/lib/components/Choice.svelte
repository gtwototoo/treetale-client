<script lang="ts">
	import clsx from 'clsx';

	import { Button } from '$UI';

	export let active: boolean;
</script>

<Button
	on:click
	variant="main"
	class={clsx(
		'adaptive-font adaptive-padding !whitespace-normal bg-main/40 text-left !text-text',
		active && 'bg-main'
	)}
>
	<slot />
</Button>
