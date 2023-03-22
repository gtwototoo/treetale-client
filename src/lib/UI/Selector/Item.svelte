<script lang="ts">
	import { Button } from '$UI';
	import { clsx } from 'clsx';

	export let active: boolean = false;
	let classes = '';
	export { classes as class };
</script>

<Button variant="secondary" class={clsx(classes, { '!bg-transparent': !active })} on:click>
	<slot />
</Button>
