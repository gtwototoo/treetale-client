<script lang="ts">
	import { clm } from '$lib/utils';

	let className = '';
	export { className as class };
</script>

<p
	class={clm(
		'select-none rounded bg-contrast bg-opacity-30 px-2 py-1 text-xs text-text childs:bg-transparent',
		className
	)}
>
	<slot />
</p>
