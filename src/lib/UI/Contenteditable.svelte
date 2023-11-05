<script lang="ts">
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	import { clm } from '$lib/utils';

	const dispatch = createEventDispatcher<{
		input: Event & { currentTarget: EventTarget & HTMLDivElement };
		paste: ClipboardEvent;
	}>();

	let className = '';
	export { className as class };

	export let html = '';
	export let placeholder: string | undefined = undefined;
	export let readonly = false;
	export let disabled = false;
	export let maxlength: number | undefined = undefined;

	let editableRef: HTMLDivElement;

	const insertText = (text: string) => {
		if (!window.getSelection) return;

		const selection = window.getSelection();

		if (!selection.getRangeAt || !selection.rangeCount) return;

		let correctText = text;
		const range = selection.getRangeAt(0);
		const rangeCount = range.endOffset - range.startOffset;

		if (maxlength && editableRef.innerText.length - rangeCount + correctText.length > maxlength) {
			const textLength = maxlength - (editableRef.innerText.length - rangeCount);

			correctText = textLength > 0 ? text.slice(0, textLength) : '';
		}

		range.deleteContents();
		range.insertNode(document.createTextNode(correctText));
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

	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLDivElement }) => {
		if (maxlength && editableRef.innerText.length + 1 > maxlength) {
			const selection = window.getSelection();
			const range = selection.getRangeAt(0);
			const startOffset = range.startOffset;

			editableRef.innerHTML = html;

			const newRange = document.createRange();

			newRange.setStart(editableRef.firstChild, startOffset - 1);
			newRange.collapse(true);

			selection.removeAllRanges();
			selection.addRange(newRange);
		}

		dispatch('input', e);
	};
</script>

<button
	tabindex="0"
	class={clm(
		'contenteditable',
		$$slots.left ? 'pl-2' : 'pl-4',
		$$slots.right ? 'pr-2' : 'pr-4',
		{ disabled },
		className
	)}
	on:click={handleClick}
>
	<slot name="left" />
	<div class="w-full relative">
		<div
			on:input={handleInput}
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
	.contenteditable {
		@apply relative flex min-h-[2.5rem] shrink-0 cursor-text items-end gap-2 rounded-lg bg-white py-2 text-left text-sm transition-colors hover:bg-main-30;
	}
	.disabled {
		@apply pointer-events-none cursor-default opacity-40;
	}
</style>
