<script lang="ts">
	import { Button } from '$UI';
	import { clsx } from 'clsx';

	export let active = false;
	let classes = '';
	export { classes as class };
</script>

<Button
	variant={active ? 'main' : 'secondary'}
	class={clsx(classes, { '!bg-blue-500': active })}
	on:click
>
	<slot />
</Button>
