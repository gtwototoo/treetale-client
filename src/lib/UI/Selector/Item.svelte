<script lang="ts">
	import { clm } from '$lib/utils';
	import { Button } from '$UI';

	let className = '';
	export { className as class };

	export let active = false;
</script>

<Button
	variant={active ? 'main' : 'ghost'}
	class={clm({ '!bg-blue-500': active }, className)}
	on:click
>
	<slot />
</Button>
