<script lang="ts">
	import { Button } from '$UI';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let fileInput: HTMLInputElement;

	let classes = '';
	export { classes as class };
	export let disabled = false;
	export let variant: 'secondary' | 'main' | 'transparent' | 'secondaryWhite' = 'secondary';

	const handleClick = (e: CustomEvent) => {
		fileInput.click();

		dispatch('click', e);
	};
</script>

<Button class={classes} on:click={handleClick} {disabled} {variant}>
	<slot />
	<input bind:this={fileInput} class="hidden" type="file" accept="image/*" on:change />
</Button>
