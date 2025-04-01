<script lang="ts">
	import { type Snippet } from 'svelte';

	import range from 'lodash/range';

	import type { RGB } from '$lib/types';
	import { clm } from '$lib/utils/classMerge';
	import { rgbToHsl, stringToRgb, varStyles } from '$lib/utils/customColors';

	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import { button as buttonPresets } from './presets';

	type ColorPickerProps = {
		button: Snippet<[{ color?: RGB }]>;
		class?: string;
		disabled?: boolean;
		onchange?: (color: RGB) => void;
		color: RGB;
	};

	let { onchange, color, disabled = false, class: classname, button }: ColorPickerProps = $props();

	const initColor = color;
	const initHsl = rgbToHsl(initColor);

	let hue = $state(initHsl[0]);
	let active = $state(false);

	const handleClick = (e: MouseEvent, newHue: number) => {
		if (disabled || !(e.target instanceof HTMLButtonElement)) return;

		hue = newHue;

		const newColor = stringToRgb(e.target.style.background);

		onchange?.(newColor);
	};

	const handleReset = () => {
		const initHue = initHsl[0];
		hue = initHue;

		onchange?.(initColor);
	};

	const customRootStyle = $derived(
		varStyles({
			'light-color': `hsl(${hue}, 70%, 70%)`,
			'dark-color': `hsl(${hue}, 30%, 30%)`
		})
	);
</script>

<Button onclick={() => (active = true)} class={classname} {disabled}>
	{@render button({ color })}
</Button>
<Modal bind:active {customRootStyle}>
	<p class="w-full pt-4 text-center text-lg">Выбор цветовой схемы</p>
	<div class="flex w-96 flex-col items-center gap-4 bg-transparent p-4">
		<div
			class="ring-main border-main-100 size-24 rounded-full border-2 bg-gradient-to-br from-[var(--light-color)] from-50% to-[var(--dark-color)] to-50% ring-2"
		></div>
		<div class="flex shrink-0 flex-wrap justify-center gap-1">
			{#each range(36) as index (index)}
				{@const eachHue = index * 10 + 5}
				{@const color = `hsl(${eachHue} 70% 70%)`}
				<button
					class={clm(
						'border-main-100 size-6 cursor-pointer rounded-md border-2',
						eachHue === hue && 'ring-main ring-2'
					)}
					aria-label="Цвет {color}"
					onclick={(e) => handleClick(e, eachHue)}
					style:background={color}
				></button>
			{/each}
		</div>
		<Button
			class={clm(buttonPresets.size.base, buttonPresets.type.primary, 'justify-center')}
			onclick={handleReset}
		>
			Сбросить цвет
		</Button>
	</div>
</Modal>
