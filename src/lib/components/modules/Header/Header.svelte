<script lang="ts">
	import { activeActions } from '$lib/stores/editing';
	import clsx from 'clsx';
	import Logo from './Logo.svelte';
	import Session from './Session.svelte';
</script>

<div
	class={clsx(
		'z-10 flex w-full justify-between p-2 sm:p-4',
		$activeActions ? 'blind' : 'childs:pointer-events-auto'
	)}
>
	<Logo />
	<div class="flex gap-2">
		<slot />
		<Session />
	</div>
</div>
