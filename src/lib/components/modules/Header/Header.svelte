<script lang="ts">
	import clsx from 'clsx';
	import Logo from './Logo.svelte';
	import Session from './Session.svelte';

	let className = '';
	export { className as class };
</script>

<div
	class={clsx(
		'z-10 flex w-full justify-between items-center bg-transparent p-2 sm:p-4',
		className
	)}
>
	<Logo />
	<div class="flex gap-4">
		<slot />
		<Session />
	</div>
</div>
