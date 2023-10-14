<script lang="ts">
	import { clm } from '$lib/utils';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		input: string;
		paste: ClipboardEvent;
	}>();

	let className = '';
	export { className as class };

	export let html = '';
	export let placeholder: string | undefined = undefined;
	export let readonly = false;
	export let disabled = false;

	let editableRef: HTMLDivElement;

	const insertText = (text: string) => {
		if (!window.getSelection) return;

		const selection = window.getSelection();

		if (!selection.getRangeAt || !selection.rangeCount) return;

		const range = selection.getRangeAt(0);

		range.deleteContents();
		range.insertNode(document.createTextNode(text));
		range.collapse(false);

		html = editableRef.innerHTML;
	};

	const handleClick = () => {
		editableRef.focus();
	};

	const handlePaste = (e: ClipboardEvent) => {
		const data = e.clipboardData;
		const text = data.getData('text/plain');

		if (!text.length) return;

		dispatch('paste', e);
		insertText(text);
	};

	const setReadonly = (node: HTMLDivElement, readonly: boolean) => {
		const setAttribute = (readonly: boolean) => {
			if (readonly) {
				node.removeAttribute('contenteditable');
			} else {
				node.setAttribute('contenteditable', '');
			}
		};

		setAttribute(readonly);

		return {
			update(readonly: boolean) {
				setAttribute(readonly);
			}
		};
	};

	$: dispatch('input', html);
</script>

<button
	tabindex="0"
	class={clm(
		'bg-white pl-4 pr-4 py-2 text-left flex shrink-0 items-center cursor-text gap-2 text-sm transition-colors hover:bg-main-30 rounded-lg relative',
		$$slots.left && 'pl-2',
		$$slots.right && 'pr-2',
		className,
		{ disabled }
	)}
	on:click={handleClick}
>
	<slot name="left" />
	<div class="w-full relative">
		<div
			role="textbox"
			on:paste|preventDefault={handlePaste}
			bind:this={editableRef}
			bind:innerHTML={html}
			use:setReadonly={readonly || disabled}
			contenteditable
			class={clsx('bg-transparent w-full', !html && 'absolute')}
		/>
		{#if placeholder && !html}
			<p class="text-gray-400 w-full whitespace-nowrap">{placeholder}</p>
		{/if}
	</div>
	<slot name="right" />
</button>

<style lang="postcss">
	.disabled {
		@apply pointer-events-none cursor-default bg-gray-100 opacity-40;
	}
</style>
