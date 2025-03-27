<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type {
		FormEventHandler,
		HTMLAttributes,
		HTMLInputAttributes,
		KeyboardEventHandler,
		MouseEventHandler
	} from 'svelte/elements';
	import { on } from 'svelte/events';

	import { clm } from '$lib/utils/classMerge';

	let {
		class: classname,
		focusClass,
		number = false,
		disabled,
		value = $bindable(''),
		left,
		right,
		required = false,
		max,
		min,
		oninput,
		onclick,
		...props
	}: {
		left?: Snippet;
		focusClass?: string;
		right?: Snippet;
		value?: string;
		number?: boolean;
		max?: number;
		min?: number;
		onclick?: HTMLAttributes<HTMLDivElement>['onclick'];
	} & Omit<HTMLInputAttributes, 'onclick' | 'size' | 'value'> = $props();

	let focused = $state(false);
	let ref = $state<HTMLInputElement>();
	let firstFocus = $state(false);

	const onlyNumbers = () => {
		value = value.replace(/[^\d-]|(?!^)[-]+/g, '');

		if (value.length !== 1 && value[0] === '0') {
			value = value.substring(1);
		}

		if (max && +value > max) {
			value = `${max}`;
		}
		if (min && +value < min) {
			value = `${min}`;
		}
	};

	const handleKeydown: KeyboardEventHandler<HTMLDivElement> = (e) => {
		const mathOperators = {
			ArrowUp: +1,
			ArrowDown: -1
		} as Record<string, number>;

		if (!number || !(e.key in mathOperators)) return;

		e.preventDefault();
		value = `${+value + mathOperators[e.key]}`;
	};

	const handleFocus = () => (focused = true);

	const handleBlur = () => (focused = false);

	const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
		if (value && number) onlyNumbers();
		oninput?.(e);
	};

	const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
		if (disabled) return;

		ref?.focus();
		onclick?.(e);
	};

	$effect(() => {
		if (value && number) onlyNumbers();
	});

	onMount(() => {
		on(ref!, 'focus', () => (firstFocus = true), {
			once: true
		});
	});

	const erroredValue = $derived(required && !value && !focused && firstFocus);
</script>

<div
	class={clm(
		'ring-main-500 text-text bg-contrast relative flex cursor-text items-center text-left ring-1',
		erroredValue && 'bg-red-500/10',
		focused && clm('bg-main-100', focusClass),
		disabled ? 'cursor-default' : 'hover:bg-main-100',
		classname
	)}
	onkeydown={handleKeydown}
	tabindex="0"
	onclick={handleClick}
	role="button"
>
	{@render left?.()}
	<input
		class={clm(
			'w-full bg-transparent [text-align:inherit] text-inherit placeholder:select-none',
			disabled && 'pointer-events-none opacity-50'
		)}
		bind:this={ref}
		bind:value
		onblur={handleBlur}
		onfocus={handleFocus}
		oninput={handleInput}
		{disabled}
		{...props}
	/>
	{@render right?.()}
</div>
