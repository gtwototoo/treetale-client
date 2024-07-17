<script lang="ts">
	import type { Snippet } from 'svelte';

	import { clm } from '$lib/utils/classMerge';

	import Logo from './Logo.svelte';
	import LogoLinearGradient from './LogoLinearGradient.svelte';
	import Session from './Session.svelte';

	let {
		children,
		class: classname,
		right
	}: {
		children?: Snippet;
		class?: string;
		right?: Snippet;
	} = $props();
</script>

<LogoLinearGradient />

<div class={clm('z-10 flex w-full justify-center bg-transparent', classname)}>
	<section class="flex w-full max-w-[120rem] items-center justify-between p-4 max-sm:p-3">
		<Logo />
		<div class="flex gap-4 max-sm:gap-2">
			{@render children?.()}
			<Session />
			{@render right?.()}
		</div>
	</section>
</div>
