<script lang="ts">
	import { clm } from '$lib/utils';
	import { onMount } from 'svelte';

	let className = '';
	export { className as class };

	export let value = '';
	export let disabled = false;
	export let readonly = false;

	let focused = false;
	let ref: HTMLTextAreaElement;

	const autoHeight = (value: string) => {
		if (!ref) return;

		if (value) {
			value.replace(/ {2,}/, ' ');
		}

		ref.style.height = `${ref.scrollHeight}px`;

		setTimeout(() => {
			ref.style.height = 'auto';
			ref.style.height = `${ref.scrollHeight}px`;
		}, 0);
	};

	const handleFocus = () => {
		focused = true;
	};

	const handleBlur = () => {
		focused = false;
	};

	onMount(() => {
		autoHeight(value);
	});

	$: autoHeight(value);
</script>

<div
	class={clm(
		'textarea',
		focused && '!bg-main-30',
		$$slots.left && '!pl-2',
		$$slots.default && '!pr-2',
		{ disabled },
		className
	)}
>
	<slot name="left" />
	<textarea
		bind:this={ref}
		bind:value
		{disabled}
		{readonly}
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:input
		{...$$props}
		rows="1"
	/>
	<slot />
</div>

<style lang="postcss">
	textarea {
		@apply w-full resize-none overflow-hidden break-all bg-transparent text-sm text-black inherit-align placeholder:whitespace-nowrap;
	}
	.textarea {
		@apply flex shrink-0 items-center gap-2 overflow-hidden rounded-lg bg-white px-4 py-2 leading-0 transition-colors hover:bg-main-30;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
