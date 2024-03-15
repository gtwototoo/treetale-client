<script lang="ts">
	import clsx from 'clsx';
	import { BookOpen } from 'svelte-heros-v2';

	import TransparentRect from './TransparentRect.svelte';

	let className = '';
	export { className as class };
</script>

<div class={clsx('relative', className)}>
	<div class="absolute inset-0 flex items-center justify-center rounded-3xl bg-contrast/20">
		<BookOpen
			class="absolute h-1/3 w-auto bg-transparent text-main transition-colors"
			variation="solid"
		/>
	</div>
	<TransparentRect />
</div>
