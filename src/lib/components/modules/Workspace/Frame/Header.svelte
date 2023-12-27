<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ChevronDown, ChevronUp } from 'svelte-heros-v2';

	import Icon from '$lib/components/Icon.svelte';
	import { Button } from '$UI';
	import clsx from 'clsx';

	export let hidden: boolean;
	export let start = false;
	export let end = false;
	export let title: string;

	const dispatch = createEventDispatcher();

	const hideFrame = () => {
		dispatch('hide');
	};
</script>

<div class="z-10 flex items-center justify-between gap-4">
	<p class={clsx('py-1 pl-4', start && 'text-emerald-500', end && 'text-blue-500')}>
		{start ? 'Начало' : title}
	</p>
	<div class="flex gap-2">
		<Button variant="ghost" class="bg-main" size="sm" on:click={hideFrame}>
			<Icon type={hidden ? ChevronUp : ChevronDown} class="h-4 w-4" />
		</Button>
	</div>
</div>
