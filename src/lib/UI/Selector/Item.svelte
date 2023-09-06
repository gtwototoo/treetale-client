<script lang="ts">
	import { Button } from '$UI';
	import { clsx } from 'clsx';

	export let active = false;
	let className = '';
	export { className as class };
</script>

<Button
	variant={active ? 'main' : 'secondary'}
	class={clsx(className, { '!bg-blue-500': active })}
	on:click
>
	<slot />
</Button>
