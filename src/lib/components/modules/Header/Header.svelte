<script lang="ts">
	import clsx from 'clsx';

	import Logo from './Logo.svelte';
	import Session from './Session.svelte';

	let className = '';
	export { className as class };
</script>

<div
	class={clsx(
		'z-10 flex w-full items-center justify-between bg-transparent p-4 max-sm:p-2',
		className
	)}
>
	<Logo />
	<div class="flex gap-4 max-sm:gap-2">
		<slot />
		<Session />
		<slot name="right" />
	</div>
</div>
