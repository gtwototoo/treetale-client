<script lang="ts">
	import { Button } from '$UI';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let className = '';
	export { className as class };

	export let disabled = false;
	export let variant: 'secondary' | 'main' | 'transparent' | 'ghost' = 'secondary';

	let fileInput: HTMLInputElement;

	const handleClick = (e: CustomEvent) => {
		fileInput.click();

		dispatch('click', e);
	};
</script>

<Button class={className} on:click={handleClick} {disabled} {variant}>
	<slot />
	<input bind:this={fileInput} class="hidden" type="file" accept="image/*" on:change />
</Button>
