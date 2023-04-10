<script lang="ts">
	import { activeAction } from '$lib/stores/newediting';
	import clsx from 'clsx';
	import Logo from './Logo.svelte';
	import Session from './Session.svelte';
</script>

<div
	class={clsx(
		'pointer-events-none z-10 flex w-full justify-between bg-transparent p-2 sm:p-4',
		$activeAction !== 'view' ? 'blind' : 'childs:pointer-events-auto'
	)}
>
	<Logo />
	<div class="flex gap-2">
		<slot />
		<Session />
	</div>
</div>
