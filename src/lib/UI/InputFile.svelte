<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Button } from '$UI';

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
