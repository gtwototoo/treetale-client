<script lang="ts">
	import { clsx } from 'clsx';

	let className = '';
	export { className as class };

	export let style = '';
</script>

<div
	class={clsx('flex flex-col items-center rounded-xl bg-white xs:rounded-2xl', className)}
	{style}
>
	<slot />
</div>
