<script lang="ts">
	import { onMount } from 'svelte';

	import clsx from 'clsx';

	import { clm } from '$lib/utils';

	let classes = '';
	export { classes as class };

	export let value = '';
	export let disabled = false;
	export let readonly = false;

	let ready = false;
	let focused = false;
	let ref: HTMLTextAreaElement;
	let back: HTMLDivElement;

	const autoHeight = (inputValue: string) => {
		if (!ref || !back) return;

		if (inputValue) {
			value = value.replace(/ {2,}/, ' ');
		}

		window.setTimeout(() => {
			if (!back.clientHeight) return;

			ref.style.height = back.clientHeight + 'px';
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

		ready = true;
	});

	$: autoHeight(value);
</script>

<div
	class={clm(
		'textarea relative',
		focused && '!bg-main-30',
		$$slots.left && '!pl-2',
		$$slots.default && '!pr-2',
		{ disabled },
		classes
	)}
>
	<slot name="left" />
	<textarea
		bind:this={ref}
		bind:value
		class={clsx(!ready && 'absolute left-0 h-full px-4 py-2')}
		{disabled}
		on:blur={handleBlur}
		on:focus={handleFocus}
		on:input
		{readonly}
		rows="1"
		{...$$restProps}
	/>
	<div
		bind:this={back}
		class={clsx('invisible w-full whitespace-pre-wrap', ready && 'absolute left-0 px-4')}
	>
		{value}
	</div>
	<slot />
</div>

<style lang="postcss">
	textarea {
		@apply w-full resize-none overflow-hidden bg-transparent text-black inherit-align placeholder:whitespace-nowrap;
	}
	.textarea {
		@apply flex shrink-0 items-center gap-2 overflow-hidden rounded-lg bg-white px-4 py-2 text-sm transition-colors hover:bg-main-30;
	}
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
