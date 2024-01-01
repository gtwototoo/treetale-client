<script lang="ts">
	import clsx from 'clsx';

	import Logo from './Logo.svelte';
	import Session from './Session.svelte';

	let className = '';
	export { className as class };
</script>

<div class={clsx('z-10 flex w-full justify-center bg-transparent', className)}>
	<section class="flex w-full max-w-[120rem] items-center justify-between p-4 max-sm:p-3">
		<Logo />
		<div class="flex gap-4 max-sm:gap-2">
			<slot />
			<Session />
			<slot name="right" />
		</div>
	</section>
</div>
