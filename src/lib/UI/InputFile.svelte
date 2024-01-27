<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Button } from '$UI';

	const dispatch = createEventDispatcher();

	let className = '';
	export { className as class };

	export let disabled = false;
	export let variant: 'custom' | 'ghost' | 'main' = 'main';
	export let loading = false;
	export let accept = 'image/*';

	let fileInput: HTMLInputElement;

	const handleClick = (e: CustomEvent) => {
		fileInput.click();

		dispatch('click', e);
	};
</script>

<Button class={className} {disabled} {loading} on:click={handleClick} {variant}>
	<slot />
	<input {accept} bind:this={fileInput} class="hidden" on:change type="file" />
</Button>
