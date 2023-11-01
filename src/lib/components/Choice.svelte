<script lang="ts">
	import { Button } from '$UI';
	import clsx from 'clsx';

	export let active: boolean;
</script>

<Button
	on:click
	variant="main"
	class={clsx(
		'!whitespace-normal !text-text text-left adaptive-font bg-main adaptive-padding',
		active && 'bg-main'
	)}
>
	<slot />
</Button>
