<script lang="ts">
	import { Button } from '$UI';
	import { clsx } from 'clsx';

	let className = '';
	export { className as class };

	export let active = false;
</script>

<Button
	variant={active ? 'main' : 'secondary'}
	class={clsx(className, { '!bg-blue-500': active })}
	on:click
>
	<slot />
</Button>
