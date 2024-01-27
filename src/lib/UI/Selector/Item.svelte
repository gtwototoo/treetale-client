<script lang="ts">
	import { Button } from '$UI';
	import { clm } from '$lib/utils';

	let className = '';
	export { className as class };

	export let active = false;
</script>

<Button
	class={clm({ '!bg-blue-500': active }, className)}
	on:click
	variant={active ? 'main' : 'ghost'}
>
	<slot />
</Button>
