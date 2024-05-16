<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import clsx from 'clsx';

	import { clm } from '$lib/utils';

	const dispatch = createEventDispatcher<{
		input: { currentTarget: EventTarget & HTMLDivElement } & Event;
		paste: ClipboardEvent;
	}>();

	let className = '';
	export { className as class };

	export let html = '';
	export let id: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let readonly = false;
	export let disabled = false;
	export let maxlength: number | undefined = undefined;
	export let pattern: (html: string) => string = undefined;

	let editableRef: HTMLDivElement;
	let focused = false;

	const handleFocus = () => {
		focused = true;
	};

	const handleBlur = () => {
		focused = false;
	};

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

	// const clearValue = (value: string) => {
	// 	let encoded = value.replace(/>/g, '&gt;').replace(/</g, '&lt;');

	// 	return encoded;
	// };

	const handleInput = (e: { currentTarget: EventTarget & HTMLDivElement } & Event) => {
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

	$: hasPattern = pattern && html && pattern(html) !== html;
</script>

<button
	class={clm(
		'contenteditable',
		$$slots.left ? 'pl-2' : 'pl-4',
		$$slots.right ? 'pr-2' : 'pr-4',
		focused && '!bg-contrast-5',
		{ disabled },
		className
	)}
	{id}
	on:click={handleClick}
	type="button"
>
	<slot name="left" />
	<div class="relative w-full self-center">
		<div
			bind:innerHTML={html}
			bind:this={editableRef}
			class={clsx(
				'w-full bg-transparent',
				!html && 'absolute',
				hasPattern && 'text-transparent caret-text'
			)}
			contenteditable
			on:blur={handleBlur}
			on:focus={handleFocus}
			on:input={handleInput}
			on:paste|preventDefault={handlePaste}
			role="textbox"
			use:setReadonly={readonly || disabled}
		/>
		{#if hasPattern}
			<div class="pointer-events-none absolute top-0 h-full w-full bg-transparent">
				{@html pattern(html)}
			</div>
		{/if}
		{#if placeholder && !html}
			<p class="w-full whitespace-nowrap text-gray-400">{placeholder}</p>
		{/if}
	</div>
	<slot name="right" />
</button>

<style lang="postcss">
	.contenteditable {
		@apply relative flex min-h-[2.5rem] shrink-0 cursor-text items-end gap-2 break-words rounded-lg bg-contrast-2 py-2 text-left text-sm transition-colors hover:bg-contrast-5;
	}
	.disabled {
		@apply pointer-events-none cursor-default opacity-40;
	}
</style>
