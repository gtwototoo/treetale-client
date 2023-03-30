<script lang="ts">
	import { page } from '$app/stores';
	import { headerTransition } from '$lib/hooks';
	import { activeActions } from '$lib/stores/editing';
	import clsx from 'clsx';
	import Logo from './Logo.svelte';
	import Session from './Session.svelte';
</script>

<div class="pointer-events-none z-10 w-full p-2 sm:px-4">
	<div
		class={clsx(
			'flex h-full w-full items-center justify-between gap-2 rounded-lg bg-white p-2 transition-opacity xs:bg-transparent xs:p-0',
			$activeActions ? 'blind' : 'childs:pointer-events-auto'
		)}
	>
		<Logo />
		<div
			class="flex grow justify-end gap-2 rounded-lg bg-white p-0 transition-[width] xs:grow-0 xs:p-2 md:gap-4 md:px-4"
			use:headerTransition={$page.url.pathname}
		>
			<slot />
			<Session />
		</div>
	</div>
</div>
