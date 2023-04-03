<script lang="ts">
	import { clsx } from 'clsx';

	export let vertical: boolean = false;
</script>

<div
	class={clsx(
		'flex childs:!rounded-none',
		{ 'flex-col': vertical },
		vertical
			? 'divide-y first:childs:!rounded-t-lg last:childs:!rounded-b-lg'
			: 'divide-x first:childs:!rounded-l-lg last:childs:!rounded-r-lg'
	)}
>
	<slot />
</div>
