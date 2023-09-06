<script lang="ts">
	import { clsx } from 'clsx';

	let className = '';

	export let vertical = false;
	export { className as class };
</script>

<div
	class={clsx(
		className,
		'flex divide-gray-100 childs:!rounded-none',
		vertical
			? 'flex-col divide-y first:childs:!rounded-t-lg last:childs:!rounded-b-lg'
			: 'divide-x first:childs:!rounded-l-lg last:childs:!rounded-r-lg'
	)}
>
	<slot />
</div>
