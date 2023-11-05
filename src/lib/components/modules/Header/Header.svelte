<script lang="ts">
	import clsx from 'clsx';

	import Logo from './Logo.svelte';
	import Session from './Session.svelte';

	let className = '';
	export { className as class };
</script>

<div
	class={clsx(
		'z-10 flex w-full justify-between items-center bg-transparent max-sm:p-2 p-4',
		className
	)}
>
	<Logo />
	<div class="flex gap-4 max-sm:gap-2">
		<slot />
		<Session />
	</div>
</div>
