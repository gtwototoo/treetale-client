<script lang="ts">
	import type { Snippet } from 'svelte';
	import type {
		ClipboardEventHandler,
		FormEventHandler,
		HTMLInputAttributes
	} from 'svelte/elements';

	import { clm } from '$lib/utils/classMerge';

	let {
		class: classname,
		id,
		html = $bindable(''),
		left,
		right,
		placeholder,
		focusClass,
		readonly = false,
		disabled = false,
		maxlength,
		pattern,
		oninput,
		onpaste,
		ref = $bindable<HTMLDivElement>()
	}: {
		html?: string;
		left?: Snippet;
		right?: Snippet;
		focusClass?: string;
		pattern?: (html: string) => string;
		oninput?: FormEventHandler<HTMLDivElement>;
		onpaste?: ClipboardEventHandler<HTMLDivElement>;
		ref?: HTMLDivElement;
	} & Pick<
		HTMLInputAttributes,
		'id' | 'placeholder' | 'disabled' | 'readonly' | 'maxlength' | 'class'
	> = $props();

	let focused = $state(false);

	const handleFocus = () => {
		focused = true;
	};

	const handleBlur = () => {
		focused = false;
	};

	const insertText = (text: string) => {
		if (!window.getSelection || !ref) return;

		const selection = window.getSelection()!;

		if (!selection.getRangeAt || !selection.rangeCount) return;

		let correctText = text;
		const range = selection.getRangeAt(0);
		const rangeCount = range.endOffset - range.startOffset;

		if (maxlength && ref.innerText.length - rangeCount + correctText.length > maxlength) {
			const textLength = maxlength - (ref.innerText.length - rangeCount);

			correctText = textLength > 0 ? text.slice(0, textLength) : '';
		}

		range.deleteContents();
		range.insertNode(document.createTextNode(correctText));
		range.collapse(false);

		html = ref.innerHTML;
	};

	const handleClick = () => {
		ref?.focus();
	};

	const handlePaste: ClipboardEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();

		const data = e.clipboardData!;
		const text = data.getData('text/plain');

		if (!text.length) return;

		onpaste?.(e);
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

	const handleInput: FormEventHandler<HTMLDivElement> = (e) => {
		if (!ref) return;

		if (ref.innerText.trim().length === 0) {
			html = '';

			return;
		}

		if (maxlength && ref.innerText.length + 1 > maxlength) {
			const selection = window.getSelection()!;
			const range = selection.getRangeAt(0);
			const startOffset = range.startOffset;

			html = html;

			const newRange = document.createRange();

			newRange.setStart(ref.firstChild!, startOffset - 1);
			newRange.collapse(true);

			selection.removeAllRanges();
			selection.addRange(newRange);
		}

		oninput?.(e);
	};

	let hasPattern = $derived(pattern && html && pattern(html) !== html);
	const isEmpty = $derived((html || '').replace(/<br>/g, '').length === 0);
</script>

{#snippet placeholderElement()}
	{#if placeholder && isEmpty}
		<p class="w-full whitespace-nowrap text-gray-400">{placeholder}</p>
	{/if}
{/snippet}

{#snippet patternElement()}
	{#if hasPattern}
		<div class="pointer-events-none absolute top-0 size-full bg-transparent">
			{@html pattern?.(html)}
		</div>
	{/if}
{/snippet}

<div
	class={clm(
		'ring-main-500 text-text relative flex min-h-[2.5rem] shrink-0 cursor-text items-end gap-2 text-left break-words ring-1',
		left && 'pl-1',
		right && 'pr-1',
		focused && clm('bg-main-100', focusClass),
		disabled ? 'cursor-default' : 'hover:bg-main-100',
		classname
	)}
	{id}
	onkeypress={() => null}
	tabindex="0"
	onclick={handleClick}
	role="button"
>
	{@render left?.()}
	<div
		class={clm(
			'relative w-full self-center overflow-hidden',
			disabled && 'pointer-events-none opacity-40'
		)}
	>
		<div
			contenteditable
			bind:innerHTML={html}
			bind:this={ref}
			class={clm(
				'w-full bg-transparent',
				!html && 'absolute',
				hasPattern && 'caret-text text-transparent'
			)}
			onblur={handleBlur}
			onfocus={handleFocus}
			oninput={handleInput}
			onpaste={handlePaste}
			role="textbox"
			use:setReadonly={readonly || disabled || false}
		></div>
		{@render patternElement()}
		{@render placeholderElement()}
	</div>
	{@render right?.()}
</div>
