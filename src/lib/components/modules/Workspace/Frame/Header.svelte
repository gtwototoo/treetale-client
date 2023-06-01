<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { frames } from '$lib/stores/editing';
	import { removeModeStore } from '$lib/stores/newediting';
	import { Button } from '$UI';
	import { createEventDispatcher } from 'svelte';
	import { ChevronDown, ChevronUp, Trash } from 'svelte-heros-v2';

	export let hidden: boolean;

	const dispatch = createEventDispatcher();

	const removeFrame = () => {
		dispatch('remove');
	};

	const hideFrame = () => {
		dispatch('hide');
	};
</script>

<div class="flex items-center justify-between gap-4">
	<slot />
	<div class="flex gap-2 text-black">
		{#if $removeModeStore}
			{#if $frames.length !== 1}
				<Button size="sm" on:click={removeFrame}>
					<Icon type={Trash} class="h-4 w-4 text-red-600" />
				</Button>
			{/if}
		{:else}
			<Button size="sm" on:click={hideFrame}>
				<Icon type={hidden ? ChevronUp : ChevronDown} class="h-4 w-4" />
			</Button>
		{/if}
	</div>
</div>
