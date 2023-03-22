<script lang="ts">
	import { clsx } from 'clsx';

	export let vertical: boolean = false;
</script>

<div
	class={clsx(
		'childs:!rounded-none flex',
		{ 'flex-col': vertical },
		vertical
			? 'first:childs:!rounded-t-lg last:childs:!rounded-b-lg'
			: 'first:childs:!rounded-l-lg last:childs:!rounded-r-lg'
	)}
>
	<slot />
</div>
