<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { Button } from '$UI';
	import { createEventDispatcher } from 'svelte';
	import { ChevronDown, ChevronUp } from 'svelte-heros-v2';

	export let hidden: boolean;

	const dispatch = createEventDispatcher();

	const hideFrame = () => {
		dispatch('hide');
	};
</script>

<div class="flex items-center justify-between gap-4 z-10">
	<slot />
	<div class="flex gap-2">
		<Button size="sm" on:click={hideFrame}>
			<Icon type={hidden ? ChevronUp : ChevronDown} class="h-4 w-4" />
		</Button>
	</div>
</div>
