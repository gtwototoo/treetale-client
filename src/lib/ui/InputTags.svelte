<script lang="ts">
	import type {
		ClipboardEventHandler,
		HTMLAttributes,
		HTMLInputAttributes,
		KeyboardEventHandler,
		MouseEventHandler
	} from 'svelte/elements';

	import remove from 'lodash/remove';
	import { XMark } from 'svelte-heros-v2';

	import { autoWidth } from '$lib/hooks/autoInputWidth';
	import { clm } from '$lib/utils/classMerge';

	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import { button } from './presets';

	let {
		class: classname,
		tags = $bindable(),
		lowerCase = false,
		disabled,
		value = '',
		maxlength = 20,
		maxcount,
		readonly,
		placeholder,
		onremove,
		onadd,
		onclick
	}: {
		tags: string[];
		maxlength?: number;
		maxcount?: number;
		lowerCase?: boolean;
		onremove?: (name: string) => void;
		onadd?: (name: string) => void;
		onclick?: HTMLAttributes<HTMLDivElement>['onclick'];
	} & Pick<
		HTMLInputAttributes,
		'id' | 'placeholder' | 'disabled' | 'readonly' | 'class' | 'value'
	> = $props();

	let focused = $state(false);
	let ref = $state<HTMLInputElement>();

	const incorrectSymbolsRegex = /[^0-9a-zA-Zа-яА-Я-]/g;

	const removeTag = (key: number) => {
		const removedValue = remove(tags, (_, index) => index === key);

		onremove?.(removedValue[0]);
	};

	const addTag = (name: string) => {
		const correctName = lowerCase ? name.toLowerCase() : name;

		value = '';

		tags.push(correctName);

		onadd?.(correctName);
	};

	const handlePaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
		e.preventDefault();

		const data = e.clipboardData;

		if (!data) return;

		const text = data.getData('text/plain');
		const replaceSpaces = text.replaceAll(' ', '-');
		const correctText = replaceSpaces.replaceAll(incorrectSymbolsRegex, '');

		const newTags = (value + correctText).match(new RegExp(`.{1,${maxlength}}`, 'g'));

		if (!newTags) return;

		for (const tag of newTags) {
			if (maxcount && tags.length === maxcount) break;

			if (tag.length === maxlength) addTag(tag);
			else value = tag;
		}
	};

	const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
		if (disabled) return;

		ref?.focus();

		onclick?.(e);
	};

	const handleKeydown: KeyboardEventHandler<HTMLDivElement> = (e) => {
		const { code, key } = e;

		const removeLastTag = () => {
			if (value || !tags.length) return;

			const lastTagIndex = tags.length - 1;

			value = tags[lastTagIndex];

			removeTag(lastTagIndex);
		};

		if (code === 'Backspace' && !value) {
			e.preventDefault();

			removeLastTag();
		}

		if (maxcount && tags.length === maxcount) {
			e.preventDefault();

			return;
		}

		if (
			incorrectSymbolsRegex.test(key) ||
			code === 'Enter' ||
			(code !== 'Backspace' && value.length >= maxlength)
		) {
			e.preventDefault();

			if (value === '') return;

			addTag(value);
		}
	};

	const inactive = $derived(readonly || disabled);
</script>

<div
	class={clm(
		'ring-main-500 text-text flex min-h-[2.5rem] cursor-text flex-wrap items-center gap-1 overflow-hidden ring-1',
		focused && 'bg-main-100',
		disabled ? 'cursor-default' : 'hover:bg-main-100',
		classname
	)}
	onkeydown={handleKeydown}
	onclick={handleClick}
	tabindex="0"
	role="button"
>
	{#each tags as tag, key (key)}
		<div
			class={clm(
				button.type.primary,
				disabled && 'bg-main-100 ring-main-200 pointer-events-none',
				'inline-flex rounded-sm text-sm select-none'
			)}
		>
			<p class={clm('leading-8', inactive ? 'px-4' : 'pl-2')}>{tag}</p>
			{#if !inactive}
				<Button class="px-1 hover:text-red-600" onclick={() => removeTag(key)}>
					<Icon class="size-4 max-h-full *:stroke-2" this={XMark} />
				</Button>
			{/if}
		</div>
	{/each}
	<input
		class={clm(
			'grow bg-transparent px-2 py-1 placeholder:select-none',
			disabled && 'pointer-events-none opacity-50'
		)}
		bind:value
		bind:this={ref}
		onblur={() => (focused = false)}
		onfocus={() => (focused = true)}
		onpaste={handlePaste}
		{placeholder}
		{readonly}
		use:autoWidth={value}
	/>
</div>
