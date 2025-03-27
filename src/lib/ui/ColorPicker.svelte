<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';

	import type { RGB } from '$lib/types';

	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import Picker from './Picker.svelte';

	type ColorPickerProps = {
		children: Snippet<[{ onclick: () => void; color?: RGB }]>;
		class?: string;
		disabled?: boolean;
	} & Pick<
		ComponentProps<typeof Picker>,
		'light' | 'saturate' | 'color' | 'saturateRange' | 'lightRange' | 'onchange'
	>;

	let {
		onchange,
		saturateRange,
		lightRange,
		light = 0,
		saturate = 0,
		color = [0, 0, 0],
		disabled = false,
		class: classname,
		children
	}: ColorPickerProps = $props();

	let active = $state(false);
</script>

<Button onclick={() => (active = true)} class={classname} {disabled}>
	{@render children({ onclick: () => (active = !active), color })}
</Button>
<Modal bind:active>
	<Picker bind:color bind:light bind:saturate {disabled} {lightRange} {onchange} {saturateRange} />
</Modal>
