<script lang="ts">
	import { clsx } from 'clsx';

	let classes: string = '';

	export let vertical: boolean = false;
	export { classes as class };
</script>

<div
	class={clsx(
		classes,
		'flex divide-gray-100 childs:!rounded-none',
		vertical
			? 'flex-col divide-y first:childs:!rounded-t-lg last:childs:!rounded-b-lg'
			: 'divide-x first:childs:!rounded-l-lg last:childs:!rounded-r-lg'
	)}
>
	<slot />
</div>
