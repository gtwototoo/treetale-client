<script lang="ts">
	import { clm } from '$lib/utils';

	let classes: string = '';

	export { classes as class };
</script>

<p
	class={clm(
		'select-none rounded bg-blue-500 bg-opacity-30 px-2 py-1 text-xs text-blue-600 childs:bg-transparent',
		classes
	)}
>
	<slot />
</p>
